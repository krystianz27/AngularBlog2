import { Request, Response } from "express";
import {
  addPost,
  deletePost,
  getAllPosts,
  getPostById,
  getPostBySlug,
  updatePost,
} from "../services/post.service";
import { z } from "zod";
import { generateSlug } from "../shared/general.util";
import { getCategoryById } from "../services/category.service";
import { getTagsByIds } from "../services/tag.service";
import {
  addPostTags,
  deletePostTagRelations,
  getPostTags,
} from "../services/post-tag.service";
import { User } from "../models/User";
import { getTotalCommentsByPostIds } from "../services/comment.service";

export const getAllPostsController = async (req: Request, res: Response) => {
  const schema = z.object({
    categoryId: z.string().optional(),
    tagId: z.string().optional(),
  });

  const user = (req as any).user as User;

  const schemaValidator = schema.safeParse(req.query);

  if (!schemaValidator.success) {
    res
      .status(400)
      .json({ message: "Invalid data", errors: schemaValidator.error });
    return;
  }

  const { categoryId, tagId } = schemaValidator.data;

  const posts = await getAllPosts({
    categoryId: categoryId ? parseInt(categoryId) : undefined,
    tagId: tagId ? parseInt(tagId) : undefined,
    userId: user?.id,
  });

  let postIds = posts.map((post) => post.id);

  const totalCommentsByPostIds = await getTotalCommentsByPostIds(postIds);

  // adding total comments to each post
  const postsWithTotalComments = posts.map((post) => {
    const totalComments = totalCommentsByPostIds.find(
      (totalCommentsByPostId) => totalCommentsByPostId.postId === post.id
    );

    return {
      ...post.toJSON(),
      totalComments: totalComments?.get("totalComments") || 0,
    };
  });
  res.json(postsWithTotalComments);
  return;
};

export const getPostBySlugController = async (req: Request, res: Response) => {
  const { slug } = req.params;

  if (!slug) {
    res.status(400).json({ message: "Invalid slug" });
    return;
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    res.status(400).json({ message: "Post not found" });
    return;
  }

  res.json(post);
  return;
};

export const addPostController = async (req: Request, res: Response) => {
  const schema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    categoryId: z.number(),
    tagIds: z.array(z.number()).optional(),
  });
  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success) {
    res.status(400).json({
      message: "Invalid data",
      errors: schemaValidator.error,
    });
    return;
  }

  const user = (req as any).user as User;

  const { title, content, categoryId, tagIds } = req.body;

  await validateTags(res, tagIds);

  let slug = generateSlug(title);

  const postWithGivenSlugName = await getPostBySlug(slug);

  if (postWithGivenSlugName) {
    slug = generateSlug(title, true);
  }

  const category = await getCategoryById(categoryId);

  if (!category) {
    res.status(400).json({
      message: "Invalid category",
    });
    return;
  }

  const post = await addPost(title, content, categoryId, user.get("id"), slug);

  if (tagIds && tagIds.length > 0) {
    addPostTags(post.id, tagIds);
  }

  res.status(201).json(post);
  return;
};

export const updatePostController = async (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const userId = user.get("id");

  const schema = z.object({
    id: z.number(),
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    categoryId: z.number().optional(),
    tagIds: z.array(z.number()).optional(),
  });

  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success) {
    res.status(400).json({
      message: "Invalid data",
      errors: schemaValidator.error,
    });
    return;
  }

  let { id, title, content, categoryId, tagIds } = req.body;

  const post = await getPostById(id);

  await validateTags(res, tagIds);

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  if (post.userId !== userId) {
    res.status(403).json({ message: "Unauthorized to update" });
    return;
  }

  if (categoryId) {
    const category = await getCategoryById(categoryId);
    if (!category) {
      res.status(400).json({ message: "Invalid category" });
      return;
    }
  }

  let slug;

  if (title && title !== post.title) {
    slug = generateSlug(title);

    const postWithGivenSlugName = await getPostBySlug(slug);
    if (postWithGivenSlugName) {
      slug = generateSlug(title, true);
    }
  }

  const updatedPost = await updatePost(id, title, content, categoryId, slug);

  const postTagsRelations = await getPostTags(id);

  if (tagIds) {
    const tagidsToDelete = postTagsRelations.filter;
  }

  if (tagIds && tagIds.length > 0) {
    tagIds = tagIds?.filter((tagId: number | undefined) => {
      const postTag = postTagsRelations.find((postTagRelation) => {
        return postTagRelation.tagId === tagId;
      });
      return !postTag;
    });

    if (tagIds.length > 0) await addPostTags(post.id, tagIds);
  }

  res.json(updatedPost);
  return;
};

export const deletePostController = async (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const userId = user.get("id");

  const schema = z.object({
    id: z.number(),
  });

  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success) {
    res.status(400).json({
      message: "Invalid data",
      errors: schemaValidator.error,
    });
    return;
  }

  const { id } = req.body;

  const post = await getPostById(id);

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  if (post.userId !== userId) {
    res.status(403).json({ message: "Unauthorized to delete" });
    return;
  }

  await deletePostTagRelations({ postId: id });

  await deletePost(id);

  res.json(post);
  return;
};

async function validateTags(res: Response, tagIds?: number[]) {
  if (tagIds && tagIds.length > 0) {
    const tags = await getTagsByIds(tagIds);

    if (tags.length !== tagIds.length) {
      res.status(400).json({
        message: "Invalid tag ids",
      });
      return;
    }
  }
}
