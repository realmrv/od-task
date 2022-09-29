import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtRefreshGuard } from './auth/jwt-refresh.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { SinginDto } from './dto/signin.dto';
import { RefreshTokenDto } from './user/dto/refresh-token.dto';
import { UserService } from './user/user.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('signin')
  async signin(@Body() singinDto: SinginDto) {
    return this.authService.login(await this.userService.create(singinDto));
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    return this.authService.logout(req.user);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  async refreshToken(@Request() req, @Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(
      req.user,
      refreshTokenDto.refreshToken,
    );
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
