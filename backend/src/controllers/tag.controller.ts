import { Request, Response } from "express";
import {
  addTag,
  deleteTag,
  getAllTags,
  getTagById,
  getTagBySlug,
} from "../services/tag.service";
import { z } from "zod";
import { generateSlug } from "../shared/general.util";
import { getPostById } from "../services/post.service";
import {
  deletePostTagRelations,
  getPostTags,
} from "../services/post-tag.service";
import { User } from "../models/User";

export const getTagsController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const user = (req as any).user as User;

  const tags = await getAllTags({
    userId: user?.get("id"),
  });
  res.json(tags);
  return;
};

export const addTagController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const schema = z.object({
    name: z.string().min(1),
  });
  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: schemaValidator.error,
    });
  }
  const user = (req as any).user as User;

  const { name } = req.body;

  let slug = generateSlug(name);

  const tagAlreadyExists = await getTagBySlug(slug);

  if (tagAlreadyExists) {
    slug = generateSlug(name, true);
  }

  const newTag = await addTag(name, slug, user?.get("id"));

  res.status(201).json(newTag);
  return;
};

export const updateTagController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const schema = z.object({
    id: z.number(),
    name: z.string().min(1),
  });

  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: schemaValidator.error,
    });
  }

  const { name, id } = req.body;

  const tag = await getTagById(id);

  if (!tag) {
    return res.status(404).json({ message: "Tag not found" });
  }

  if (tag.name === name) {
    return res.status(400).json({ message: "Nothing was changed." });
  }

  let slug = generateSlug(name);
  const tagAlreadyExists = await getTagBySlug(slug);

  if (tagAlreadyExists) {
    slug = generateSlug(name, true);
  }

  tag.name = name;
  tag.slug = slug;
  await tag.save();

  return res.status(200).json(tag);
};

export const deleteTagController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const schema = z.object({
    id: z.number(),
  });

  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success)
    return res
      .status(400)
      .json({ message: "Invalid data", errors: schemaValidator.error });

  const { id } = req.body;
  const tag = await getTagById(id);

  if (!tag) {
    return res.status(404).json({ message: "Tag not found" });
  }

  await deletePostTagRelations({ tagId: id });

  await deleteTag(id);

  return res.json(tag);
};

export const getPostTagsController = async (
  req: Request,
  res: Response
): Promise<any> => {
  let postId: any = req.params.postId;

  postId = parseInt(postId);

  if (!postId) {
    return res.status(400).json({ message: "Post Id is required" });
    // return;
  }

  const post = await getPostById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
    // return;
  }

  const postTags = await getPostTags(postId);

  return res.json(postTags);
};

export const getTagBySlugController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { slug } = req.params;

  const tag = await getTagBySlug(slug);

  if (!tag) {
    res.status(404).json({ message: "Tag not found" });
  }

  return res.json(tag);
};
