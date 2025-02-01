import { model, Schema } from "mongoose";
import {
  BlogModel,
  CategoryModel,
  CommentsModel,
  CommentsReplyModel,
  IBlog,
  ICateogry,
  IComments,
  ICommentsReply,
} from "./blogs.interface";

const blogsSchmea = new Schema<IBlog, BlogModel>(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

blogsSchmea.pre("save", function (next) {
  if (!this.id) {
    this.id = this._id;
  }
  next();
});

const commentsSchema = new Schema<IComments, CommentsModel>(
  {
    blogId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

commentsSchema.pre("save", function (next) {
  if (!this.id) {
    this.id = this._id;
  }
  next();
});

const commentsReplySchema = new Schema<ICommentsReply, CommentsReplyModel>(
  {
    commentId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

commentsReplySchema.pre("save", function (next) {
  if (!this.id) {
    this.id = this._id;
  }
  next();
});

const CommentsReply = model<ICommentsReply, CommentsReplyModel>(
  "CommentsReply",
  commentsReplySchema
);

const categorySchema = new Schema<ICateogry, CategoryModel>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

categorySchema.pre("save", function (next) {
  if (!this.id) {
    this.id = this._id;
  }
  next();
});

const Category = model<ICateogry, CategoryModel>("Category", categorySchema);
const Comments = model<IComments, CommentsModel>("Comments", commentsSchema);

const Blogs = model<IBlog, BlogModel>("Blogs", blogsSchmea);

export { Blogs, Comments, CommentsReply, Category };
