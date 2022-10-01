import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsJWT()
  @ApiProperty({ description: 'Refresh token', nullable: false })
  refreshToken: string;
}
