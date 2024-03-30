import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkflowService } from './workflow/workflow.service';
import { WorkflowController } from './workflow/workflow.controller';

@Module({
  imports: [],
  controllers: [AppController, WorkflowController],
  providers: [AppService, WorkflowService],
})
export class AppModule {}
