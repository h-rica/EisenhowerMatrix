import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('port');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Global prefix
  const globalPrefix = 'api';
  app.setGlobalPrefix('api');

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || `http://localhost:${port}`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  // Swagger documentation
  const documentConfig = new DocumentBuilder()
    .setTitle('Eisenhower Matrix API')
    .setDescription('A comprehensive task management system based on the Eisenhower Matrix')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
