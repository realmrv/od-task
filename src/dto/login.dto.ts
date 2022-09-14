import { PickType } from '@nestjs/mapped-types';
import { SinginDto } from './signin.dto';

export class LoginDto extends PickType(SinginDto, [
  'email',
  'password',
] as const) {}
