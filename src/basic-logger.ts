import { Injectable } from '@nestjs/common';
import { StandardLogger } from 'zeddy-logger';
import { ConsoleOutput, FileOutput } from 'zeddy-logger/outputs';

@Injectable()
export class BasicLogger extends StandardLogger {
  constructor() {
    const outputs = [
      new ConsoleOutput({
        tagToConsoleFunctionMap: [
          { tagName: 'log-level', tagValue: 'info', consoleFunction: 'info' },
          { tagName: 'log-level', tagValue: 'debug', consoleFunction: 'debug' },
        ],
      }),
      new FileOutput({
        filename: 'basic-logs.txt',
      }),
    ];
    super(outputs);
  }
}
