import ServiceModel from "../../../helpers/serviceModel";
import fs from "fs";
import path from "path";
import { IBlog, ICateogry, IComments } from "./blogs.interface";
import { Blogs, Category, Comments, CommentsReply } from "./blogs.model";
import { IResponseType } from "../../../helpers/responseReturn";

class BlogService extends ServiceModel {
  Blog: typeof Blogs;
  Comment: typeof Comments;
  Reply: typeof CommentsReply;
  Category: typeof Category;
  constructor() {
    super();
    this.Blog = Blogs;
    this.Comment = Comments;
    this.Reply = CommentsReply;
    this.Category = Category;
  }
  createBlog = async (
    data: IBlog,
    author: string,
    media: Express.Multer.File
  ) => {
    data.author = author;
    const isExist = await this.Blog.findOne({ title: data.title });
    if (isExist) {
      throw new this.AppError(this.HttpStatus.CONFLICT, "Blog already exist");
    }

    const slug = this.slugify(data.title);

    // check blog   folder exist or not
    const contentPath = path.join(__dirname, "../../../../uploads/blogs");
    if (!fs.existsSync(contentPath)) {
      fs.mkdirSync(contentPath, { recursive: true });
    }

    // check media exist or not

    if (media) {
      const mediaPath = path.join(contentPath, media.originalname);
      fs.writeFileSync(mediaPath, media.buffer);
      data.banner = `blogs/${media.originalname}`;
    }

    data.slug = slug;

    const blog = await this.Blog.create(data);
    return blog;
  };

  getBlogs = async (
    query: Record<string, string>
  ): Promise<IResponseType<IBlog[]>> => {
    const { skipQuery, searchQuery, limitQuery, pageQuery, filter } =
      this.queryMaker(query);
    if (searchQuery) {
      filter.title = { $regex: searchQuery, $options: "i" };
    }
    const blogs = await this.Blog.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "id",
          as: "category",
        },
      },
      {
        $addFields: {
          category: { $arrayElemAt: ["$category", 0] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "id",
          as: "author",
        },
      },
      {
        $addFields: {
          author: { $arrayElemAt: ["$author", 0] },
        },
      },

      {
        $lookup: {
          from: "comments",
          localField: "id",
          foreignField: "blogId",
          as: "comments",
          pipeline: [
            {
              $lookup: {
                from: "commentsreplies",
                localField: "id",
                foreignField: "commentId",
                as: "replies",
                pipeline: [
                  {
                    $lookup: {
                      from: "users",
                      localField: "user",
                      foreignField: "id",
                      as: "user",
                    },
                  },
                  {
                    $addFields: {
                      user: { $arrayElemAt: ["$user", 0] },
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "id",
                as: "user",
              },
            },
            {
              $addFields: {
                user: { $arrayElemAt: ["$user", 0] },
              },
            },
          ],
        },
      },
      {
        $match: filter,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: skipQuery,
      },
      {
        $limit: limitQuery,
      },
    ]);
    return {
      data: blogs,
      meta: {
        page: pageQuery,
        limit: limitQuery,
        total: await this.Blog.countDocuments(filter),
      },
    };
  };

  getBlog = async (id: string): Promise<IBlog> => {
    const blog = await this.Blog.findById(id);
    if (!blog) {
      throw new this.AppError(this.HttpStatus.NOT_FOUND, "Blog not found");
    }
    return blog;
  };

  updateBlog = async (id: string, data: IBlog, media: Express.Multer.File) => {
    const blog = await this.Blog.findById(id);
    if (!blog) {
      throw new this.AppError(this.HttpStatus.NOT_FOUND, "Blog not found");
    }
    const slug = this.slugify(data.title);

    // check blog   folder exist or not
    const contentPath = path.join(__dirname, "../../../../uploads/blogs");
    if (!fs.existsSync(contentPath)) {
      fs.mkdirSync(contentPath, { recursive: true });
    }

    // check media exist or not
    if (media) {
      const mediaPath = path.join(contentPath, media.originalname);
      fs.writeFileSync(mediaPath, media.buffer);
      data.banner = `blogs/${media.originalname}`;
    }

    data.slug = slug;

    const updatedBlog = await this.Blog.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updatedBlog;
  };

  deleteBlog = async (id: string) => {
    const blog = await this.Blog.findById(id);
    if (!blog) {
      throw new this.AppError(this.HttpStatus.NOT_FOUND, "Blog not found");
    }
    return await this.Blog.findByIdAndDelete(id);
  };

  async createComment(comment: IComments) {
    const newComment = await this.Comment.create(comment);
    return newComment;
  }

  async getComments(blogId: string) {
    const comments = await this.Comment.find({ blogId });
    return comments;
  }

  async createReply(reply: IComments) {
    const newReply = await this.Reply.create(reply);
    return newReply;
  }

  async getReplies(commentId: string) {
    const replies = await this.Reply.find({ commentId });
    return replies;
  }

  async deleteComment(commentId: string) {
    const comment = await this.Comment.findByIdAndDelete(commentId);
    return comment;
  }

  async deleteReply(replyId: string) {
    const reply = await this.Reply.findByIdAndDelete(replyId);
    return reply;
  }

  async createCategory(data: ICateogry) {
    data.slug = this.slugify(data.name);
    const isExist = await this.Category.findOne({ name: data.name });
    if (isExist) {
      throw new this.AppError(
        this.HttpStatus.CONFLICT,
        "Category already exist"
      );
    }
    const category = await this.Category.create(data);
    return category;
  }

  async getCategories() {
    const categories = await this.Category.find();
    return categories;
  }

  async getCategory(id: string) {
    const category = await this.Category.findById(id);
    if (!category) {
      throw new this.AppError(this.HttpStatus.NOT_FOUND, "Category not found");
    }
    return category;
  }

  async updateCategory(id: string, data: ICateogry) {
    const category = await this.Category.findById(id);
    if (!category) {
      throw new this.AppError(this.HttpStatus.NOT_FOUND, "Category not found");
    }
    const updatedCategory = await this.Category.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updatedCategory;
  }

  async deleteCategory(id: string) {
    const category = await this.Category.findById(id);
    if (!category) {
      throw new this.AppError(this.HttpStatus.NOT_FOUND, "Category not found");
    }
    return await this.Category.findByIdAndDelete(id);
  }
}

export default BlogService;
