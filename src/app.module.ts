import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestInterceptor } from './request.interceptor';
import { RequestBasedLogger } from './request-based-logger';
import { BasicLogger } from './basic-logger';
import { AdvancedLogger } from './advanced-logger';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    RequestBasedLogger,
    BasicLogger,
    AdvancedLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestInterceptor,
    },
  ],
})
export class AppModule {}
