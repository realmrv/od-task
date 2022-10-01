import { ApiProperty } from '@nestjs/swagger';
import { UserTagDto } from './user-tag.dto';

export class UserInfoDto {
  @ApiProperty({ format: 'email' })
  email: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty({ type: [UserTagDto] })
  tags: UserTagDto[];
}
