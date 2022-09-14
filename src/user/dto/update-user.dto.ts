import { PartialType } from '@nestjs/mapped-types';
import { IsJWT, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsJWT()
  @IsOptional()
  refreshToken?: string;
}
