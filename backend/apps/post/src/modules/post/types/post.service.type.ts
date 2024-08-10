import { Sort } from '@app/shared';
import { CreatePostDto } from '../dtos/create-post.dto';
import { OrderBy } from '../enums/order-by.enum';

export type TCreateInput = {
  createPostDto: CreatePostDto;
  userId: number;
};

export type TFindInput = {
  authorId?: number;
  order?: {
    by: OrderBy;
    sort: Sort;
  };
  perPage?: number;
  page?: number;
};

export type TFindOneInput = {
  id: number;
};

export type TPostInsertResult = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  commentCount: number;
};
