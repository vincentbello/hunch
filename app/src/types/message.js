import { type User } from './user';

export type Message = {
  id: number,
  author: User,
  content: string,
};
