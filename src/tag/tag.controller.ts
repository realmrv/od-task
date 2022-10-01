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
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { GetTagsPramsDto } from './dto/get-tags-params.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { Action } from '../casl/action.enum';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { PaginatedDto } from '../dto/paginated.dto';
import { TagDto } from './dto/tag.dto';
import { ApiPaginatedResponse } from '../decorators/api-paginated.decorator';

@ApiTags('Tags')
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
@UseGuards(JwtAuthGuard)
@Controller('tag')
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create tag' })
  create(@Request() req, @Body() createTagDto: CreateTagDto): Promise<TagDto> {
    return this.tagService.create(createTagDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated tags' })
  @ApiPaginatedResponse(TagDto)
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    params: GetTagsPramsDto,
  ): Promise<PaginatedDto<TagDto>> {
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
  @ApiOperation({ summary: 'Get tag by id' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TagDto> {
    const tag = await this.tagService.findOne(id);
    if (!tag) {
      throw new NotFoundException();
    }
    return tag;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update tag by id' })
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<TagDto> {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    const tag = await this.tagService.findOne(id);

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
  @ApiOperation({ summary: 'Delete tag by id' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'You must be the owner of the tag',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    const tag = await this.tagService.findOne(id);

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
