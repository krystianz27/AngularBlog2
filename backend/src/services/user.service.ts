import { User } from "../models/User";
import { encryptPassword } from "../shared/auth.util";

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await User.findOne({ where: { email } });
};

export const addUser = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  const user = new User();
  user.email = email;
  user.password = password;
  user.name = name;

  return await user.save();
};

export const getUserById = async (userId: number): Promise<User | null> => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    return user ? user : null;
  } catch (error) {
    throw new Error("Error fetching user");
  }
};

export const updateUser = async (
  userId: number,
  name?: string,
  email?: string,
  password?: string,
  status?: "active" | "pending"
): Promise<User | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (name) {
    user.name = name;
  }

  if (email) {
    user.email = email;
  }

  if (password) {
    user.password = encryptPassword(password);
  }

  if (status) {
    user.status = status;
  }

  await user.save();

  const userWithoutPassword = user.toJSON();
  delete userWithoutPassword.password;

  return userWithoutPassword as Omit<User, "password">;
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await user.destroy();
  } catch (error) {
    throw new Error("Failed to delete user: " + (error as Error).message);
  }
};
