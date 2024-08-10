import { CreateCommentDto } from '../dtos/create-comment.dto';

export type TCreateInput = {
  createCommentDto: CreateCommentDto;
  postId: number;
  userId: number;
};

export type TInsertCommentResult = {
  id: number;
  postId: number;
  content: string;
  authorId: number;
};

export type TFindInput = {
  postId: number;
};
