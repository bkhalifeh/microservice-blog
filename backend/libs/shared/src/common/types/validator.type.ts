import { tags } from 'typia';

export type TSlug = string & tags.Pattern<'^[a-z0-9]+(-[a-z0-9]+)*$'>;
export type TId = number & tags.Minimum<1> & tags.Maximum<2147483647>;
