// app.service.ts

import { Injectable } from '@nestjs/common';
import { main } from './appMock/app';

@Injectable()
export class AppService {
  async runApp(): Promise<void> {
    try {
      await main();
    } catch (error) {
      // Handle errors
      console.error('Error occurred while running the app:', error);
      throw error;
    }
  }
}
