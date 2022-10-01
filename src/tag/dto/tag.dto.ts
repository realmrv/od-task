import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Tag } from '../entities/tag.entity';

class CreatorDto {
  @ApiProperty({ format: 'uuid' })
  uid: string;

  @ApiProperty()
  nickname: string;
}

export class TagDto extends OmitType(Tag, ['creator', 'users'] as const) {
  @ApiProperty()
  creator: CreatorDto;
}
