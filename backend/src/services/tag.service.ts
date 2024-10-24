import { z } from "zod";
import { Tag } from "../models/Tag";

export const getallTags = async () => {
  return await Tag.findAll();
};

export const addTag = async (name: string, slug: string, userId: number) => {
  const tag = new Tag();
  tag.name = name;
  tag.slug = slug;
  tag.userId = userId;

  await tag.save();
  return tag;
};

export const getTagBySlug = async (slug: string) => {
  return await Tag.findOne({
    where: { slug },
  });
};

export const getTagById = async (id: number) => {
  return await Tag.findByPk(id);
};

export const getTagsByIds = async (ids: number[]) => {
  return await Tag.findAll({
    where: { id: ids },
  });
};

export const deleteTag = async (id: number) => {
  return await Tag.destroy({
    where: { id },
  });
};
