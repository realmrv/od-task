import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class GetTagsPrams {
  @IsOptional()
  @Transform(({ value }) => value === '')
  @IsBoolean()
  sortByOrder?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === '')
  @IsBoolean()
  sortByName?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  length?: number;
}
