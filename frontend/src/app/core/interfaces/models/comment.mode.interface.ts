import { IUser } from './user.model.interface';

export interface IComment {
  id: number;
  postId: number;
  content: string;
  user: IUser;
  createdAt: string;
  updatedAt: string;
}
