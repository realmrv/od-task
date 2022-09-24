import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['warn', 'error']
        : ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(+process.env.APP_PORT, process.env.APP_HOST);
}
bootstrap();
