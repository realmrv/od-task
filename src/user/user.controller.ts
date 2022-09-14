import {
  Controller,
  Get,
  Put,
  Body,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async find(@Request() req) {
    const { password, uid, refreshToken, ...result } =
      await this.userService.findOne(req.user.uid);
    return result;
  }

  @Put()
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.update(req.user.uid, updateUserDto);
    const { password, uid, refreshToken, ...result } =
      await this.userService.findOne(req.user.uid);
    return result;
  }

  @Delete()
  remove(@Request() req) {
    this.userService.remove(req.user.uid);
  }
}
