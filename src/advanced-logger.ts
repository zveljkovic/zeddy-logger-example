import { Inject, Injectable, Scope } from '@nestjs/common';
import { AppRequest } from './app-request';
import { REQUEST } from '@nestjs/core';
import { LoggerBase, StandardLogger } from 'zeddy-logger';
import { ConsoleOutput, FileOutput } from 'zeddy-logger/outputs';
import { AxiosInstance } from 'axios';

export const LogLevel = {
  info: { name: 'log-level', value: 'info' },
  debug: { name: 'log-level', value: 'debug' },
  warning: { name: 'log-level', value: 'warning' },
  error: { name: 'log-level', value: 'debug' },
};

export const LogType = {
  text: { name: 'log-type', value: 'text' },
  httpOutbound: { name: 'log-type', value: 'http-outbound' },
};

@Injectable({ scope: Scope.REQUEST })
export class AdvancedLogger extends LoggerBase {
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
        transform: async (logData) => {
          // Do not send httpOutbound to FileOutput
          if (
            logData.tags.some(
              (x) => x.name === 'log-type' && x.value === 'httpOutbound',
            )
          ) {
            return null;
          }
          return logData;
        },
      }),
    ];
    super(outputs);
  }

  info(message: string, data?: any) {
    this.log({ tags: [LogLevel.info, LogType.text], data, message });
  }

  debug(message: string, data?: any) {
    this.log({ tags: [LogLevel.debug, LogType.text], data, message });
  }

  warning(message: string, data?: any) {
    this.log({ tags: [LogLevel.warning, LogType.text], data, message });
  }

  error(message: string, data?: any) {
    this.log({ tags: [LogLevel.error, LogType.text], data, message });
  }

  httpOutbound(http: AxiosInstance) {
    let startTime: number;
    http.interceptors.request.use(
      (value) => {
        startTime = new Date().valueOf();
        return value;
      },
      (error) => {},
    );
    http.interceptors.response.use(
      (value) => {
        let duration = new Date().valueOf() - startTime;
        const url = `${value.request.protocol}//${value.request.host}${value.request.path}`;
        this.log({
          message: `Outbound to ${url} took ${duration}ms`,
          tags: [LogLevel.info, LogType.httpOutbound],
          data: {
            statusCode: value.status,
            responseBody: value.data,
            responseHeader: value.headers,
            url: url,
            requestBody: value.request.data,
          },
        });
        return value;
      },
      (error) => {},
    );
  }
}
