import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function fastFood() {
  const logger = new Logger('APP');
  const port = process.env.PORT;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  //? Open API
  const config = new DocumentBuilder()
    .setTitle('Fast Food API V2')
    .setDescription('Second Version of Fast Food Api Project')
    .setVersion('2.0')
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(port);
  logger.log(`🤖 running on port ${port}`);
}
fastFood();
