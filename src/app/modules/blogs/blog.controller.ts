import catchAsync from "../../../helpers/catchAsync";
import BlogService from "./blog.service";
import { Request, Response } from "express";

class BlogController {
  constructor(private blogService: BlogService) {}

  createBlog = catchAsync(async (req: Request, res: Response) => {
    const blog = await this.blogService.createBlog(
      JSON.parse(req.body.data),
      req.user?.userId as string,
      (req.files as { [fieldname: string]: Express.Multer.File[] })?.banner?.[0]
    );
    this.blogService.Response(res, {
      data: blog,
      message: "Blog created successfully",
      success: true,
    });
  });

  getBlogs = catchAsync(async (req: Request, res: Response) => {
    const blogs = await this.blogService.getBlogs(
      req.query as Record<string, string>
    );
    this.blogService.Response(res, {
      data: blogs.data,
      meta: blogs.meta,
      message: "Blogs fetched successfully",
      success: true,
    });
  });

  getBlogById = catchAsync(async (req: Request, res: Response) => {
    const blog = await this.blogService.getBlog(req.params.id);
    this.blogService.Response(res, {
      data: blog,
      message: "Blog fetched successfully",
      success: true,
    });
  });

  updateBlog = catchAsync(async (req: Request, res: Response) => {
    const blog = await this.blogService.updateBlog(
      req.params.id,
      JSON.parse(req.body.data),
      (req.files as { [fieldname: string]: Express.Multer.File[] })?.banner?.[0]
    );
    this.blogService.Response(res, {
      data: blog,
      message: "Blog updated successfully",
      success: true,
    });
  });

  deleteBlog = catchAsync(async (req: Request, res: Response) => {
    const blog = await this.blogService.deleteBlog(req.params.id);
    this.blogService.Response(res, {
      data: blog,
      message: "Blog deleted successfully",
      success: true,
    });
  });

  createComment = catchAsync(async (req: Request, res: Response) => {
    req.body.user = req.user?.userId;
    const comment = await this.blogService.createComment(req.body);
    this.blogService.Response(res, {
      data: comment,
      message: "Comment created successfully",
      success: true,
    });
  });

  createReply = catchAsync(async (req: Request, res: Response) => {
    req.body.user = req.user?.userId;
    const reply = await this.blogService.createReply(req.body);
    this.blogService.Response(res, {
      data: reply,
      message: "Reply created successfully",
      success: true,
    });
  });

  getComments = catchAsync(async (req: Request, res: Response) => {
    const comments = await this.blogService.getComments(req.params.id);
    this.blogService.Response(res, {
      data: comments,
      message: "Comments fetched successfully",
      success: true,
    });
  });

  getReplies = catchAsync(async (req: Request, res: Response) => {
    const replies = await this.blogService.getReplies(req.params.id);
    this.blogService.Response(res, {
      data: replies,
      message: "Replies fetched successfully",
      success: true,
    });
  });

  deleteComment = catchAsync(async (req: Request, res: Response) => {
    const comment = await this.blogService.deleteComment(req.params.id);
    this.blogService.Response(res, {
      data: comment,
      message: "Comment deleted successfully",
      success: true,
    });
  });

  deleteReply = catchAsync(async (req: Request, res: Response) => {
    const reply = await this.blogService.deleteReply(req.params.id);
    this.blogService.Response(res, {
      data: reply,
      message: "Reply deleted successfully",
      success: true,
    });
  });

  createCategory = catchAsync(async (req: Request, res: Response) => {
    const category = await this.blogService.createCategory(req.body);
    this.blogService.Response(res, {
      data: category,
      message: "Category created successfully",
      success: true,
    });
  });

  getCategories = catchAsync(async (req: Request, res: Response) => {
    const categories = await this.blogService.getCategories();
    this.blogService.Response(res, {
      data: categories,
      message: "Categories fetched successfully",
      success: true,
    });
  });

  getCategory = catchAsync(async (req: Request, res: Response) => {
    const category = await this.blogService.getCategory(req.params.id);
    this.blogService.Response(res, {
      data: category,
      message: "Category fetched successfully",
      success: true,
    });
  });

  updateCategory = catchAsync(async (req: Request, res: Response) => {
    const category = await this.blogService.updateCategory(
      req.params.id,
      req.body
    );
    this.blogService.Response(res, {
      data: category,
      message: "Category updated successfully",
      success: true,
    });
  });

  deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const category = await this.blogService.deleteCategory(req.params.id);
    this.blogService.Response(res, {
      data: category,
      message: "Category deleted successfully",
      success: true,
    });
  });
}

const blogController = new BlogController(new BlogService());

export default blogController;
