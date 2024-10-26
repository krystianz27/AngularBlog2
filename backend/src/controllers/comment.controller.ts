import { Request, Response } from "express";
import { z } from "zod";
import { getPostById } from "../services/post.service";
import {
  addComment,
  getCommendById,
  getPostComments,
  updateComment,
} from "../services/comment.service";
import { User } from "../models/User";

export const getPostCommentsController = async (
  req: Request,
  res: Response
) => {
  const schema = z.object({
    postId: z.number(),
  });

  const schemaValidator = schema.safeParse({
    postId: parseInt(req.params.postId),
  });

  if (!schemaValidator.success) {
    res.status(400).json({
      message: "Invalid data",
      errors: schemaValidator.error,
    });
    return;
  }

  const { postId } = schemaValidator.data;

  const post = await getPostById(postId);
  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  const comments = await getPostComments(postId);

  res.json(comments);
  return;
};

export const addCommentController = async (req: Request, res: Response) => {
  const schema = z.object({
    postId: z.number(),
    content: z.string().min(1),
  });

  console.log("$$$$$$$$$$$$$$$$$");

  const user: User = (req as any).user;

  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success) {
    res.status(400).json({
      message: "Invalid data",
      errors: schemaValidator.error,
    });
    return;
  }

  const { postId, content } = req.body;

  const userId = user.get("id");

  const post = await getPostById(postId);
  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  const comment = await addComment(postId, userId, content);

  res.json(comment);
  return;
};

export const updateCommentController = async (req: Request, res: Response) => {
  const schema = z.object({
    commentId: z.number(),
    content: z.string().min(1),
  });

  const user = (req as any).user as User;

  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success) {
    res.status(400).json({
      message: "Invalid data",
      errors: schemaValidator.error,
    });
    return;
  }

  const { commentId, content } = schemaValidator.data;
  const userId = user.get("id");

  const comment = await getCommendById(commentId);

  if (!comment) {
    res.status(400).json({ message: "Invalid comment ID" });
    return;
  }

  if (comment.userId !== userId) {
    res
      .status(400)
      .json({ message: "You are not allowed to edit the comment" });
    return;
  }

  const updatedComment = await updateComment(commentId, content);

  res.json(updatedComment);
  return;
};

export const deleteCommentController = async (req: Request, res: Response) => {
  const schema = z.object({
    commentId: z.number(),
  });

  const user = (req as any).user as User;

  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success) {
    res.status(400).json({
      message: "Invalid data",
      errors: schemaValidator.error,
    });
    return;
  }

  const { commentId } = schemaValidator.data;
  const userId = user.get("id");

  const comment = await getCommendById(commentId);
  if (!comment) {
    res.status(400).json({ message: "Invalid comment ID" });
    return;
  }

  if (comment.userId !== userId) {
    res
      .status(400)
      .json({ message: "You are not allowed to delete the comment" });
    return;
  }

  await comment.destroy();
  res.json({ message: "Comment deleted" });
  return;
};
