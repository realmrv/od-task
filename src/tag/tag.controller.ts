import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseGuards,
  Request,
  ParseIntPipe,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { GetTagsPrams } from './types/get-tags.params';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TagsResponseBody } from './types/tags-response-body.type';

@UseGuards(JwtAuthGuard)
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  async create(@Request() req, @Body() createTagDto: CreateTagDto) {
    const { creator, ...result } = await this.tagService.create(
      createTagDto,
      req.user,
    );
    return result;
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    params: GetTagsPrams,
  ): Promise<TagsResponseBody> {
    const result = await this.tagService.findAll(
      params.offset,
      params.length,
      params.sortByOrder,
      params.sortByName,
    );
    return {
      data: result.items,
      meta: {
        offset: params.offset,
        length: params.length,
        quantity: result.count,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const tag = await this.tagService.findOne(id);
    if (!tag) {
      throw new NotFoundException();
    }
    return tag;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    const result = await this.tagService.update(id, updateTagDto);

    if (!result.affected) {
      throw new NotFoundException();
    }

    return this.tagService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.tagService.remove(id);
    if (!result.affected) {
      throw new NotFoundException();
    }
  }
}
