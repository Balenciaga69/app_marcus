import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  logWithRequestId(message: string, requestId?: string) {
    if (requestId) {
      super.log(`[${requestId}] ${message}`);
    } else {
      super.log(message);
    }
  }
  // 你也可以覆寫 error/warn/debug 等方法
}
