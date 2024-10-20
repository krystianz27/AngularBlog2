import { Request, Response } from "express";
import {
  addTag,
  deleteTag,
  getallTags,
  getTagById,
  getTagBySlug,
} from "../services/tag.service";
import { z } from "zod";
import { generateSlug } from "../shared/general.util";

export const getTagsController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const tags = await getallTags();
  return res.json(tags);
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
    // return;
  }
  const { name } = req.body;

  let slug = generateSlug(name);

  const tagAlreadyExists = await getTagBySlug(slug);

  if (tagAlreadyExists) {
    slug = generateSlug(name, true);
  }

  const newTag = await addTag(name, slug, 1);

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

  await deleteTag(id);

  return res.json(tag);
};
