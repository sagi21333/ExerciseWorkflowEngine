import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowParams, Workflow } from './workflow.types';
import { Step } from '../step/step';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  createWorkflow(@Body() workflow: Workflow) {
    const newWorkflow = this.workflowService.createWorkflow(workflow.id, workflow.steps);
    return { message: 'Workflow created successfully',  newWorkflow};
  }

  @Put(':id/stepName')
  addStepToWorkflow(@Param('id') id: string, @Body() stepName: string) {
    return this.workflowService.addStepToWorkflow(id, stepName);
  }

  @Put(':id/dependency')
  addDependencyToStep(@Param('id') id: string, @Body() dependency: { stepId: string, dependentStepId: string }) {
    return this.workflowService.addDependencyToStep(id, dependency.stepId, dependency.dependentStepId);
  }

  @Post(':id/execute')
  executeWorkflowById(@Param('id') id: string, @Body() params: WorkflowParams) {
    return this.workflowService.executeWorkflowById(id, params);
  }

  @Get(':id')
  getWorkflowById(@Param('id') id: string) {
    return this.workflowService.getWorkflowById(id);
  }
}
