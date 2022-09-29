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
  ForbiddenException,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { GetTagsPrams } from './types/get-tags.params';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TagsResponseBody } from './types/tags-response-body.type';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { Action } from '../casl/action.enum';

@UseGuards(JwtAuthGuard)
@Controller('tag')
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

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
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    const tag = await this.findOne(id);

    if (!tag) {
      throw new NotFoundException();
    }

    if (ability.can(Action.Update, tag)) {
      await this.tagService.update(id, updateTagDto);
    } else {
      throw new ForbiddenException('You must be the owner of the tag');
    }

    return this.tagService.findOne(id);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    const tag = await this.findOne(id);

    if (!tag) {
      throw new NotFoundException();
    }

    if (ability.can(Action.Delete, tag)) {
      this.tagService.remove(id);
    } else {
      throw new ForbiddenException('You must be the owner of the tag');
    }
  }
}
