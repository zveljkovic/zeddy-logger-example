import { Inject, Injectable, Scope } from '@nestjs/common';
import { AppRequest } from './app-request';
import { REQUEST } from '@nestjs/core';
import { StandardLogger } from 'zeddy-logger';
import { ConsoleOutput, FileOutput } from 'zeddy-logger/outputs';

@Injectable({ scope: Scope.REQUEST })
export class RequestBasedLogger extends StandardLogger {
  constructor(@Inject(REQUEST) private request: AppRequest) {
    const outputs = [
      new ConsoleOutput({
        transform: async (logData) => {
          return {
            message: logData.message,
            tags: logData.tags,
            data: {
              ...logData.data,
              randomNumberFromInterceptor: request.randomNumberFromInterceptor,
            },
          };
        },
        tagToConsoleFunctionMap: [
          { tagName: 'log-level', tagValue: 'info', consoleFunction: 'info' },
          { tagName: 'log-level', tagValue: 'debug', consoleFunction: 'debug' },
        ],
      }),
      new FileOutput({
        filename: 'logs.txt',
      }),
    ];
    super(outputs);
  }
}