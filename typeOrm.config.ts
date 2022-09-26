import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from './src/user/entities/user.entity';
import { CreateUsers1662820361908 } from './migrations/1662820361908-CreateUsers';
import { AddRefreshTokenToUsers1663162872160 } from './migrations/1663162872160-AddRefreshTokenToUsers';
import { Tag } from './src/tag/entities/tag.entity';
import { CreateTags1664181337487 } from './migrations/1664181337487-CreateTags';
import { CreateUsersTags1664181480837 } from './migrations/1664181480837-CreateUsersTags';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: [User, Tag],
  migrations: [
    CreateUsers1662820361908,
    AddRefreshTokenToUsers1663162872160,
    CreateTags1664181337487,
    CreateUsersTags1664181480837,
  ],
});
