import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtRefreshGuard } from './auth/jwt-refresh.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './user/dto/refresh-token.dto';
import { UserService } from './user/user.service';
import { JwtSetDto } from './auth/dto/jwt-set.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login user by email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  login(@Request() req): Promise<JwtSetDto> {
    return this.authService.login(req.user);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async signIn(@Body() signInDto: SignInDto): Promise<JwtSetDto> {
    return this.authService.login(await this.userService.create(signInDto));
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Request() req) {
    this.authService.logout(req.user);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh JWT by refresh token' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  refreshToken(
    @Request() req,
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<JwtSetDto> {
    return this.authService.refreshToken(
      req.user,
      refreshTokenDto.refreshToken,
    );
  }

  @ApiExcludeEndpoint()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
