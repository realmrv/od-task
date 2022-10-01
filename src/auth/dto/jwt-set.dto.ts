import { ApiProperty } from '@nestjs/swagger';

export class JwtSetDto {
  @ApiProperty({ description: 'JWT', nullable: false })
  token: string;

  @ApiProperty({ description: 'JWT expiration date', nullable: false })
  expire: number;

  @ApiProperty({ description: 'Refresh JWT', nullable: false })
  refreshToken: string;
}
