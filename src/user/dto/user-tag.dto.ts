import { OmitType } from '@nestjs/swagger';
import { Tag } from '../../tag/entities/tag.entity';

export class UserTagDto extends OmitType(Tag, ['creator', 'users'] as const) {}
