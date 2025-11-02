import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

function setupCors(app: INestApplication<any>) {
  app.enableCors({
    origin: 'http://localhost:3000', // 只允許前端本機
    credentials: true, // 若有 cookie 認證需求
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupCors(app);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
