import { ICategory } from './category.model.interface';
import { IUser } from './user.model.interface';

export interface IPost {
  id: number;
  title: string;
  content: string;
  slug: string;
  user: IUser;
  category: ICategory;
  createdAt: string;
  updatedAt: string;
}
