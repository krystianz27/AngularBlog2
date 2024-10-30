import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { addUser, getUserByEmail, updateUser } from "../services/user.service";
import {
  encryptPassword,
  generateToken,
  verifyToken,
} from "../shared/auth.util";
import { addToken, deleteTokens, getToken } from "../services/token.service";
import {
  sendConfirmationEmail,
  sendForgotPasswordEmail,
} from "../shared/email.util";

const passwordZodRules = z
  .string()
  .min(6)
  .max(100)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter and one number.",
  });

export const registerController = async (req: Request, res: Response) => {
  const schema = z.object({
    name: z.string().min(3).max(100),
    email: z.string().email(),
    password: passwordZodRules,
  });

  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success) {
    res.status(400).json({
      message: "Invalid data",
      errors: schemaValidator.error,
    });
    return;
  }

  let { name, email, password } = schemaValidator.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    res.status(400).json({ message: "Email already in use" });
    return;
  }

  password = encryptPassword(password);

  let user = await addUser(email, password, name);
  user = user.toJSON();
  delete user.password;

  const token = generateToken(user.id);

  // console.log("TOKEN:", token);

  await addToken(token, "activation", user.id);

  await sendConfirmationEmail(email, token);

  res.status(201).json({ message: "User registered successfully", user });
};

export const loginController = async (req: Request, res: Response) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
  });
  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success) {
    res.status(400).json({
      message: "Invalid data",
      errors: schemaValidator.error,
    });
    return;
  }

  const { email, password } = schemaValidator.data;

  const user = await getUserByEmail(email);

  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }

  if (user.get("status") !== "active") {
    res
      .status(403)
      .json({ message: "User is not active. Please confirm your email." });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password!);

  if (!isPasswordValid) {
    res.status(400).json({ message: "Incorrect password" });
    return;
  }

  const accessToken = generateToken(user.get("id"), "7d");
  const refreshToken = generateToken(user.get("id"), "7d");

  await deleteTokens(user.get("id"));

  await addToken(refreshToken, "refresh", user.get("id"));
  await addToken(accessToken, "access", user.get("id"));

  const session = {
    accessToken,
    refreshToken,
    user: user.toJSON(),
  };

  delete session.user.password;

  res.json(session);
  return;
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const schema = z.object({
    refreshToken: z.string(),
  });

  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success) {
    res.status(400).json({
      message: "Invalid data",
      errors: schemaValidator.error,
    });
    return;
  }

  const { refreshToken } = schemaValidator.data;

  const isTokenValid = verifyToken(refreshToken);
  if (!isTokenValid) {
    res.status(400).json({ message: "Invalid token or expired" });
    return;
  }

  const dbRefreshToken = await getToken(refreshToken);

  if (!dbRefreshToken || dbRefreshToken.get("type") !== "refresh") {
    res.status(400).json({ message: "Invalid token" });
    return;
  }

  const userId = dbRefreshToken.get("userId");

  const accessToken = generateToken(userId!);
  const newRefreshToken = generateToken(userId!, "7d");

  await deleteTokens(userId!);

  await addToken(refreshToken, "refresh", userId!);
  await addToken(accessToken, "access", userId!);

  res.json({ accessToken, refreshToken: newRefreshToken });
  return;
};

export const logoutController = async (req: Request, res: Response) => {
  const schema = z.object({
    refreshToken: z.string(),
  });

  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success) {
    res.status(400).json({
      message: "Invalid data",
      errors: schemaValidator.error,
    });
    return;
  }

  const { refreshToken } = schemaValidator.data;

  const isTokenValid = verifyToken(refreshToken);
  if (!isTokenValid) {
    res.status(400).json({ message: "Invalid token or expired" });
    return;
  }

  const dbRefreshToken = await getToken(refreshToken);

  if (!dbRefreshToken || dbRefreshToken.get("type") !== "refresh") {
    res.status(400).json({ message: "Invalid token" });
    return;
  }

  const userId = dbRefreshToken.get("userId");

  await deleteTokens(userId!);

  res.json({ message: "User logged out successfully" });
  return;
};

export const confirmEmailController = async (req: Request, res: Response) => {
  const { token } = req.params;
  console.log("Received token:", token);
  const isTokenValid = verifyToken(token);

  if (!isTokenValid) {
    res.status(400).json({ message: "Invalid token or expired" });
    return;
  }

  console.log("TOKEN TO@", token);

  const dbToken = await getToken(token);

  console.log("token confirm: ", dbToken);

  if (!dbToken || dbToken.get("type") !== "activation") {
    res.status(400).json({ message: "Invalid token!@" });
    return;
  }

  const userId = dbToken.get("userId");

  if (!userId) {
    res.status(400).json({ message: "User ID not found" });
    return;
  }

  console.log("TOKEN DELETE");

  await updateUser(userId, undefined, undefined, "active");

  await deleteTokens(userId);

  // res.status(200).json({ message: "Email confirmed" });
  res.redirect(process.env.FRONTEND_URL + "#/auth/login");
  return;
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  const schema = z.object({
    email: z.string().email(),
  });

  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success) {
    res.status(400).json(schemaValidator.error);
    return;
  }
  const { email } = schemaValidator.data;

  const user = await getUserByEmail(email);

  if (!user) {
    res.status(400).json({ message: "User not found." });
    return;
  }
  const token = generateToken(user.get("id"));

  await deleteTokens(user.get("id"));

  await addToken(token, "reset", user.get("id"));

  await sendForgotPasswordEmail(email, token);

  res.status(200).json({ message: "Email has been sent." });
  return;
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const schema = z.object({
    token: z.string(),
    password: passwordZodRules,
  });

  const parsedData = schema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json(parsedData.error);
    return;
  }

  const { token, password } = parsedData.data;

  const isTokenValid = verifyToken(token);

  if (!isTokenValid) {
    res.status(400).json({ message: "Invalid token or expired." });
    return;
  }

  console.log("Token####", token);

  const dbToken = await getToken(token);

  console.log("DBToken####", token);

  if (!dbToken || dbToken.get("type") !== "reset") {
    res.status(400).json({ message: "Invalid token.!@@" });
    return;
  }

  const userId = dbToken.get("userId");

  if (!userId) {
    res.status(400).json({ message: "User ID not found." });
    return;
  }

  const encryptedPassword = encryptPassword(password);

  await updateUser(userId, undefined, encryptedPassword);

  await deleteTokens(userId!);

  res.status(200).json({ message: "Password updated." });
  return;
};
