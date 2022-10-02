import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as redisStore from 'cache-manager-redis-store';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DbValidatorsModule } from '@youba/nestjs-dbvalidator';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { dbOptions } from './db-options';
import { TagModule } from './tag/tag.module';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      url: process.env.REDIS_URL,
    }),
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      ...dbOptions,
    } as TypeOrmModuleOptions),
    DbValidatorsModule.register(dbOptions),
    UserModule,
    AuthModule,
    TagModule,
    CaslModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
