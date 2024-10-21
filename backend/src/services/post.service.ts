import { Category } from "../models/Category";
import { Post } from "../models/Post";
import { Tag } from "../models/Tag";
import { User } from "../models/User";

export const getAllPosts = async (filters: {
  categoryId?: number;
  tagId?: number;
  userId?: number;
}) => {
  let where: any = {};

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.userId) {
    where.userId = filters.userId;
  }

  return await Post.findAll({
    where,
    include: [
      Category,
      {
        model: User,
        attributes: {
          exclude: ["password"],
        },
      },
      {
        model: Tag,
        where: filters.tagId
          ? {
              id: filters.tagId,
            }
          : undefined,
      },
    ],
  });
};

export const getPostBySlug = async (slug: string) => {
  return await Post.findOne({
    include: [Category],
    where: { slug },
  });
};

export const addPost = async (
  title: string,
  content: string,
  cateogryId: number,
  userId: number,
  slug: string
) => {
  const post = new Post();
  post.title = title;
  post.content = content;
  post.categoryId = cateogryId;
  post.userId = userId;
  post.slug = slug;

  return await post.save();
};

export const getPostById = async (postId: number) => {
  return await Post.findByPk(postId);
};

export const updatePost = async (
  postId: number,
  title?: string,
  content?: string,
  categoryId?: number,
  slug?: string
) => {
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  if (title) {
    post.title = title;
  }
  if (content) {
    post.content = content;
  }
  if (categoryId) {
    post.categoryId = categoryId;
  }
  if (slug) {
    post.slug = slug;
  }

  return await post.save();
};

export const deletePost = async (postId: number) => {
  return await Post.destroy({
    where: { id: postId },
  });
};
