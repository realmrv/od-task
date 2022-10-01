import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'Tag name', nullable: false })
  readonly name: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Sort order', nullable: true, required: false })
  readonly sortOrder: number;
}
