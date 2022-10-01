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
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  @Validate(IsUnique, [{ table: 'users', column: 'email' }])
  @ApiProperty({ description: 'User email', nullable: false, format: 'email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 100)
  @Matches(/(?=.*\d)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password must contain at least one number, one uppercase and one lowercase letter',
  })
  @ApiProperty({
    description: 'User password',
    nullable: false,
    example: '1Example',
    format: 'password',
  })
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @Validate(IsUnique, [{ table: 'users', column: 'nickname' }])
  @ApiProperty({ description: 'User nickname', nullable: false })
  readonly nickname: string;
}
