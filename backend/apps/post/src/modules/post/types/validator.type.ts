import { tags } from 'typia';

export type TIdOrSlug = string &
  tags.Pattern<'^([a-z0-9]+(-[a-z0-9]+)*|\\d+)$'>;
