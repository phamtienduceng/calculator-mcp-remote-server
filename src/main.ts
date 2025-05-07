import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors();

  // Set up validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Serve static files from the public directory
  app.useStaticAssets(join(__dirname, '..', 'public'));

  console.log('Server starting on http://localhost:3000');
  await app.listen(3000);
}
bootstrap();
