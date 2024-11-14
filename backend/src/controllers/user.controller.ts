import { Request, Response } from "express";
import { deleteUser, getUserById, updateUser } from "../services/user.service";
import { z } from "zod";

export const getUserController = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const user = await getUserById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
    return;
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const schema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
  });

  const validation = schema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ message: "Invalid data", errors: validation.error });
    return;
  }

  try {
    const updatedUser = await updateUser(
      userId,
      validation.data.name,
      validation.data.email,
      validation.data.password
    );
    res.json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    await deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};
