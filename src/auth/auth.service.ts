import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { jwtConstants } from './constants';
import { JwtPayload } from './types/jwt-payload.type';
import { JwtSetDto } from './dto/jwt-set.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await this.compareWithHashedString(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: User) {
    return this.getTokensSet(this.getJwtPayload(user));
  }

  logout(user: User) {
    this.updateRefreshToken(null, user.uid);
  }

  async refreshToken(user: User, refreshToken: string): Promise<JwtSetDto> {
    if (
      user.refreshToken &&
      (await this.compareWithHashedString(refreshToken, user.refreshToken))
    ) {
      await this.updateRefreshToken(null, user.uid);
      return this.getTokensSet(this.getJwtPayload(user));
    }
    throw new UnauthorizedException();
  }

  protected async getTokensSet(payload: JwtPayload): Promise<JwtSetDto> {
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: jwtConstants.refreshExpiresIn,
      secret: jwtConstants.refreshSecret,
    });

    await this.updateRefreshToken(refreshToken, payload.sub);
    return {
      token: this.jwtService.sign(payload),
      expire: 3600,
      refreshToken,
    };
  }

  protected async updateRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<void> {
    if (refreshToken) {
      refreshToken = await this.getHashedString(refreshToken);
    }

    this.userService.update(userId, {
      refreshToken,
    });
  }

  getJwtPayload(user: User): JwtPayload {
    return { email: user.email, sub: user.uid };
  }

  async getHashedString(original: string): Promise<string> {
    return argon2.hash(original);
  }

  async compareWithHashedString(
    original: string,
    hashed: string,
  ): Promise<boolean> {
    return argon2.verify(hashed, original);
  }
}
