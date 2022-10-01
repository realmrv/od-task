import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

class PaginatedMetaDto {
  @ApiProperty()
  offset: number;
  @ApiProperty()
  length: number;
  @ApiProperty()
  quantity: number;
}

export class PaginatedDto<TData> {
  @ApiProperty()
  meta: PaginatedMetaDto;

  @IsArray()
  @ApiProperty()
  data: TData[];
}
