import {
  Controller,
  Get,
  Put,
  Body,
  Delete,
  Request,
  UseGuards,
  Post,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { AssociateTagsDto } from './dto/associate-tags.dto';

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

  @Get('/tag/my')
  async findMyTags(@Request() req) {
    return { tags: await this.userService.findOwnsTags(req.user.uid) };
  }

  @Post('/tag')
  async associateTags(
    @Request() req,
    @Body()
    tags: AssociateTagsDto,
  ) {
    await this.userService.associateTags(req.user.uid, tags.tags);
    return { tags: await this.userService.findAssociatedTags(req.user.uid) };
  }

  @Delete('/tag/:id')
  async dissociateTag(@Request() req, @Param('id', ParseIntPipe) id: number) {
    await this.userService.dissociateTag(req.user.uid, id);
    return { tags: await this.userService.findAssociatedTags(req.user.uid) };
  }
}
