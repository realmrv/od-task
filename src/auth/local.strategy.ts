import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<any> {
    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new UnauthorizedException('password and username must be a string');
    }
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }
    return user;
  }
}
