import { Model } from "mongoose";

export interface IBlog {
  id?: string;
  title: string;
  banner?: string;
  content: string;
  category: string;
  slug: string;
  author: string;
  createdAt?: Date;
  updatedAt?: Date;
  tags?: string[];
}

export interface IComments {
  id?: string;
  blogId: string;
  content: string;
  user: string;
}

export interface ICommentsReply {
  id?: string;
  commentId: string;
  content: string;
  user: string;
}

export interface ICateogry {
  id?: string;
  name: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CategoryModel = Model<ICateogry>;
export type BlogModel = Model<IBlog>;
export type CommentsModel = Model<IComments>;
export type CommentsReplyModel = Model<ICommentsReply>;
