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
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { AssociateTagsDto } from './dto/associate-tags.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserTagsDto } from './dto/user-tags.dto';
import { UserInfoDto } from './dto/user-info-dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';

@ApiTags('Users')
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Current user info' })
  async find(@Request() req): Promise<UserInfoDto> {
    const { password, uid, refreshToken, ...result } =
      await this.userService.findOne(req.user.uid, ['tags']);
    return result;
  }

  @Put()
  @ApiOperation({ summary: 'Update current user' })
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponseDto> {
    await this.userService.update(req.user.uid, updateUserDto);
    const { password, uid, refreshToken, ...result } =
      await this.userService.findOne(req.user.uid);
    return result;
  }

  @Delete()
  @ApiOperation({ summary: 'Delete current user' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req) {
    await this.userService.remove(req.user.uid).catch((err) => {
      console.log(err);
      throw new BadRequestException(
        "Failed to delete the current user. The user probably didn't remove their tags.",
      );
    });
  }

  @Get('/tag/my')
  @ApiOperation({ summary: 'Tags owned by current user' })
  async findMyTags(@Request() req): Promise<UserTagsDto> {
    return { tags: await this.userService.findOwnsTags(req.user.uid) };
  }

  @Post('/tag')
  @ApiOperation({ summary: 'Associate tags with current user' })
  async associateTags(
    @Request() req,
    @Body()
    tags: AssociateTagsDto,
  ): Promise<UserTagsDto> {
    await this.userService.associateTags(req.user.uid, tags.tags);
    return { tags: await this.userService.findAssociatedTags(req.user.uid) };
  }

  @Delete('/tag/:id')
  @ApiOperation({ summary: 'Dissociate tags with current user' })
  async dissociateTag(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserTagsDto> {
    await this.userService.dissociateTag(req.user.uid, id);
    return { tags: await this.userService.findAssociatedTags(req.user.uid) };
  }
}
