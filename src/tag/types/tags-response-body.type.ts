import { Tag } from '../entities/tag.entity';

export type TagsResponseBody = {
  data: Tag[];
  meta: {
    offset: number;
    length: number;
    quantity: number;
  };
};
