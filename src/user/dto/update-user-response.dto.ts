import { OmitType } from '@nestjs/swagger';
import { UserInfoDto } from './user-info-dto';

export class UpdateUserResponseDto extends OmitType(UserInfoDto, [
  'tags',
] as const) {}
