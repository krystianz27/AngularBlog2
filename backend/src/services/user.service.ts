import { User } from "../models/User";

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

export const getUserById = async (id: number): Promise<User | null> => {
  return await User.findByPk(id);
};

export const updateUser = async (
  userId: number,
  name?: string,
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

  if (password) {
    user.password = password;
  }

  if (status) {
    user.status = status;
  }

  return await user.save();
};
