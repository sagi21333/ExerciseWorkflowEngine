// app.service.ts

import { Injectable } from '@nestjs/common';
import { main as mainMock } from './appMock/app';

@Injectable()
export class AppService {
  async runApp(): Promise<void> {
    try {
      // Testing mock
      await mainMock();
    } catch (error) {
      console.error('Error occurred while running the app:', error);
      throw error;
    }
  }
}
