import { ApiProperty } from '@nestjs/swagger';
import { UserTagDto } from './user-tag.dto';

export class UserTagsDto {
  @ApiProperty({ type: [UserTagDto] })
  tags: UserTagDto[];
}
