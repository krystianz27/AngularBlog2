import { Request, Response } from "express";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
} from "../services/category.service";
import { generateSlug } from "../shared/general.util";
import { z } from "zod";

export const getCategories = async (req: Request, res: Response) => {
  const categories = await getAllCategories();

  res.json(categories);
};

export const addCategoryController = async (req: Request, res: Response) => {
  const schema = z.object({
    name: z.string().min(1),
  });
  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success) {
    res.status(400).json({
      message: "Invalid data",
      errors: schemaValidator.error,
    });
  }

  const { name } = req.body;
  const userId = 1;
  let slug = generateSlug(name);

  const categoryBySlug = await getCategoryBySlug(slug);

  if (categoryBySlug) {
    slug = generateSlug(name, true);
  }

  const category = await addCategory(name, slug, userId);

  res.json(category);
};

export const updateCategoryController = async (req: Request, res: Response) => {
  const schema = z.object({
    name: z.string().min(1),
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

  let { id, name } = req.body;
  let slug = generateSlug(name);

  const categoryBySlug = await getCategoryBySlug(slug);

  if (categoryBySlug) {
    res.status(400).json({ message: "Category already exists" });
    return;
  }

  let dbCategory = await getCategoryById(id);

  if (!dbCategory) {
    res.status(404).json({ message: "Category not found" });
    return;
  }

  let updatedCategory = await updateCategory(name, slug, id);

  res.json(updatedCategory);
};

export const deleteCategoryController = async (req: Request, res: Response) => {
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
  const category = getCategoryById(id);

  if (!category) {
    res.status(404).json({ message: "Category not found" });
    return;
  }

  await deleteCategory(id);

  res.json({ message: "delete category" });
};
