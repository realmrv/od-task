import { IsExist } from '@youba/nestjs-dbvalidator';
import { ArrayNotEmpty, IsArray, IsNotEmpty, Validate } from 'class-validator';

export class AssociateTagsDto {
  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsArray()
  @Validate(IsExist, [{ table: 'tags', column: 'id', isArray: true }])
  tags: number[];
}
