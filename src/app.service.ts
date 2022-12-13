import { Injectable } from '@nestjs/common';
import { RequestBasedLogger } from './request-based-logger';
import { BasicLogger } from './basic-logger';
import axios from 'axios';
import { AdvancedLogger } from './advanced-logger';

@Injectable()
export class AppService {
  constructor(
    private readonly requestBasedLogger: RequestBasedLogger,
    private readonly basicLogger: BasicLogger,
    private readonly advancedLogger: AdvancedLogger,
  ) {}

  async loggerTest() {
    this.requestBasedLogger.info('log info message');
    this.requestBasedLogger.info('log info message with data', { a: 1, b: 2 });
    this.basicLogger.info('log info message');
    this.basicLogger.info('log info message with data', { a: 1, b: 2 });

    const http = axios.create();
    this.advancedLogger.httpOutbound(http);
    await http.get('https://jsonplaceholder.typicode.com/todos/1');

    return 'log test finished';
  }
}
