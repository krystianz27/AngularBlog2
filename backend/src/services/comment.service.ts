import { Sequelize, where } from "sequelize";
import { Comment } from "../models/Comment";
import { User } from "../models/User";

export const getAllComments = async () => {
  return await Comment.findAll();
};

export const getPostComments = async (postId: number) => {
  return await Comment.findAll({
    include: [
      {
        model: User,
        attributes: {
          exclude: ["password"],
        },
      },
    ],
    where: { postId },
    order: [["createdAt", "DESC"]],
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

  console.log(comment.content);

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

export const deletePostComments = async (postId: number | number[]) => {
  return await Comment.destroy({
    where: { postId },
  });
};

export const getTotalCommentsByPostIds = async (postIds: number[]) => {
  return Comment.findAll({
    attributes: [
      "postId",
      [Sequelize.fn("COUNT", Sequelize.col("id")), "totalComments"],
    ],
    where: {
      postId: postIds,
    },
    group: ["postId"],
  });
};
