import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerService } from './common/logger/logger.service';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { PollOption } from './entities/poll-option.entity';
import { Poll } from './entities/poll.entity';
import { Vote } from './entities/vote.entity';
import { HealthModule } from './modules/health/health.module';
import { PollOptionModule } from './modules/poll-option/poll-option.module';
import { PollModule } from './modules/poll/poll.module';

@Module({
  imports: [
    PollModule,
    PollOptionModule,
    HealthModule,
    ConfigModule.forRoot(), // 載入 .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'user'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_DATABASE', 'db'),
        entities: [Poll, PollOption, Vote], // 註冊 Entity
        synchronize: true, // 開發階段自動同步 schema（生產環境設 false）
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
