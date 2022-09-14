import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  Validate,
} from 'class-validator';
import { IsUnique } from '@youba/nestjs-dbvalidator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  @Validate(IsUnique, [{ table: 'users', column: 'email' }])
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 100)
  @Matches(/(?=.*\d)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password must contain at least one number, one uppercase and one lowercase letter',
  })
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @Validate(IsUnique, [{ table: 'users', column: 'nickname' }])
  readonly nickname: string;
}
