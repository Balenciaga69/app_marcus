/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const requestId: string = req.requestId;
    const url: string = req.url;
    const method: string = req.method;
    const now = Date.now();

    this.logger.logWithRequestId(`Request: ${method} ${url}`, requestId);

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - now;
        this.logger.logWithRequestId(`Response: ${method} ${url} - ${ms}ms`, requestId);
      })
    );
  }
}
