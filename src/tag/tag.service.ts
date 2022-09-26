import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  create(createTagDto: CreateTagDto, user: User) {
    return this.tagsRepository.save({
      creator: user,
      ...createTagDto,
    });
  }

  async findAll(
    offset?: number,
    limit?: number,
    sortByOrder = false,
    sortByName = false,
  ): Promise<{ items: Tag[]; count: number }> {
    const [items, count] = await this.tagsRepository.findAndCount({
      select: {
        id: true,
        name: true,
        sortOrder: true,
        creator: { uid: true, nickname: true },
      },
      skip: offset,
      take: limit,
      relations: ['creator'],
      order: {
        name: sortByName ? 'ASC' : undefined,
        sortOrder: sortByOrder ? 'ASC' : undefined,
      },
    });

    return { items, count };
  }

  findOne(id: number): Promise<Tag> {
    return this.tagsRepository.findOne({
      select: {
        id: true,
        name: true,
        sortOrder: true,
        creator: { uid: true, nickname: true },
      },
      where: { id },
      relations: ['creator'],
    });
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return this.tagsRepository.update({ id }, updateTagDto);
  }

  remove(id: number) {
    return this.tagsRepository.delete({ id });
  }
}
