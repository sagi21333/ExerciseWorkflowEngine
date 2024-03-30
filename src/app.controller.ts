// app.controller.ts

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/run-app')
  async runApp(): Promise<void> {
    try {
      await this.appService.runApp();
    } catch (error) {
      // Handle errors
      console.error('Error occurred while running the app:', error);
      throw error;
    }
  }
}
