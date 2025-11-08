import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/logger/logging.interceptor';
import { LoggerService } from './common/logger/logger.service';
import { DataSource } from 'typeorm';
import { seedDatabase } from './database/seed';

function setupCors(app: INestApplication<any>) {
  app.enableCors({
    origin: 'http://localhost:3000', // 只允許前端本機
    credentials: true, // 若有 cookie 認證需求
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupCors(app);

  // 啟用全域 ValidationPipe，讓 class-validator 生效
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自動移除 DTO 中未定義的屬性
      forbidNonWhitelisted: true, // 當出現未定義屬性時拋出錯誤
      transform: true, // 自動將請求參數轉換為 DTO 類型
    })
  );

  app.useGlobalInterceptors(new LoggingInterceptor(app.get(LoggerService)));

  // 執行種子填充
  const dataSource = app.get(DataSource);
  await seedDatabase(dataSource);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
