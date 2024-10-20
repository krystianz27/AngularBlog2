import { Comment } from "../models/Comment";

export const getAllComments = async () => {
  return await Comment.findAll();
};

export const getPostComments = async (postId: number) => {
  return await Comment.findAll({
    where: { postId },
  });
};

export const addComment = async (
  postId: number,
  userId: number,
  content: string
) => {
  const comment = new Comment();
  comment.postId = postId;
  comment.userId = userId;
  comment.content = content;

  return await comment.save();
};

export const getCommendById = async (id: number) => {
  return await Comment.findByPk(id);
};

export const updateComment = async (commentId: number, content: string) => {
  const comment = await getCommendById(commentId);

  if (!comment) {
    throw new Error("Comment not found");
  }

  comment.content = content;

  return await comment.save();
};

export const deleteComment = async (commentId: number) => {
  const comment = await getCommendById(commentId);
  if (!comment) {
    throw new Error("Comment not found");
  }

  return await comment.destroy();
};
