import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class GetTagsPramsDto {
  @IsOptional()
  @Transform(({ value }) => value === '')
  @IsBoolean()
  @ApiProperty()
  sortByOrder?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === '')
  @IsBoolean()
  @ApiProperty()
  sortByName?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty()
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiProperty()
  length?: number;
}
