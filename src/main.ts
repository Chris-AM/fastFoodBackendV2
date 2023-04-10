//! Nest Modules
import { ValidationPipe, Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//! Third Party Modules
import * as cookieParser from 'cookie-parser';
//! Local Modules
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';

async function fastFood() {
  const logger = new Logger('APP');
  const port = process.env.PORT;
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.enableCors();
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalInterceptors(new LoggerInterceptor());
  //? Open API
  const config = new DocumentBuilder()
    .setTitle('Fast Food API V2')
    .setDescription('Second Version of Fast Food Api Project')
    .setVersion('2.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(port);
  logger.log(`🤖 running on port ${port}`);
}
fastFood();
