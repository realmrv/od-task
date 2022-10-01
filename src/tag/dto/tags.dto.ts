import { ApiProperty } from '@nestjs/swagger';
import { TagDto } from './tag.dto';

export class TagsDto {
  @ApiProperty({ type: [TagDto] })
  tags: TagDto[];
}
