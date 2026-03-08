import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { join } from 'path';
import { LoggingInterceptor } from './Helpers/Interceptors/logging.interceptor';
import { Logger } from '@nestjs/common';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  const logger = new Logger('Main');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: false,
      exceptionFactory: (errors) => {
        const messages = errors.flatMap((err) =>
          Object.values(err.constraints ?? {}),
        );

        return new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          message: messages,
        });
      },
    }),
  );

  app.enableCors({
    origin: '*',
    methods: '*',
    credentials: false,
  });

  const staticPath = join(__dirname, 'API', 'Directory');
  app.use('/static', express.static(staticPath));

  app.use(bodyParser.json({ limit: '2gb' }));
  app.use(bodyParser.urlencoded({ limit: '2gb', extended: true }));
  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Order Manager API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'authorization',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, documentFactory, {
    swaggerOptions: {
      tagsSorter: 'alpha',
    },
  });

  await app.listen(port);

  console.log(`Seja Bem Vindo: Acesse http://localhost:${port}/swagger`);
}

bootstrap();
