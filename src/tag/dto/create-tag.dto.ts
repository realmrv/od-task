import { IsUnique } from '@youba/nestjs-dbvalidator';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  @Validate(IsUnique, [{ table: 'tags', column: 'name' }])
  readonly name: string;

  @IsOptional()
  @IsNumber()
  readonly sortOrder: number;
}
