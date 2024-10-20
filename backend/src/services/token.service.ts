import { Token } from "../models/Token";

export const addToken = async (
  token: string,
  type: "activation" | "reset" | "access" | "refresh",
  userId: number
) => {
  const tokenInstance = new Token();
  tokenInstance.token = token;
  tokenInstance.type = type;
  tokenInstance.userId = userId;

  return await tokenInstance.save();
};

export const deleteTokens = async (userId: number) => {
  return await Token.destroy({
    where: { userId },
  });
};

export const getToken = async (token: string) => {
  return await Token.findOne({ where: { token } });
};
