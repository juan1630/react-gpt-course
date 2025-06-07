import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors();
  app.use(bodyParser.json({limit: '10mb'}))
  app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
  //todos los dominios pueden hacer peticiones
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
