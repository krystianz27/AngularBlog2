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
import { addPostTags } from "../services/post-tag.service";

export const getAllPostsController = async (req: Request, res: Response) => {
  const posts = await getAllPosts();
  res.json(posts);
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

  const { title, content, categoryId, tagIds } = req.body;

  if (tagIds && tagIds.length > 0) {
    const tags = await getTagsByIds(tagIds);

    if (tags.length !== tagIds.length) {
      res.status(400).json({
        message: "Invalid tag ids",
      });
      return;
    }
  }

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

  const post = await addPost(title, content, categoryId, 1, slug);

  if (tagIds && tagIds.length > 0) {
    addPostTags(post.id, tagIds);
  }
  res.status(201).json(post);
};

export const updatePostController = async (req: Request, res: Response) => {
  const userId = 1;
  const schema = z.object({
    id: z.number(),
    title: z.string().min(1),
    content: z.string().min(1),
    categoryId: z.number(),
  });

  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success) {
    res.status(400).json({
      message: "Invalid data",
      errors: schemaValidator.error,
    });
    return;
  }

  const { id, title, content, categoryId } = req.body;

  const post = await getPostById(id);

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  if (post.userId !== userId) {
    res.status(403).json({ message: "Unauthorized to update" });
    return;
  }

  const category = await getCategoryById(categoryId);
  if (!category) {
    res.status(400).json({ message: "Invalid category" });
    return;
  }
  let slug;

  if (title !== post.title) {
    slug = generateSlug(title);

    const postWithGivenSlugName = await getPostBySlug(slug);
    if (postWithGivenSlugName) {
      slug = generateSlug(title, true);
    }
  }

  const updatedPost = await updatePost(id, title, content, categoryId, slug);

  res.json(updatedPost);
  return;
};

export const deletePostController = async (req: Request, res: Response) => {
  const userId = 1;

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

  await deletePost(id);

  res.json(post);
  return;
};
