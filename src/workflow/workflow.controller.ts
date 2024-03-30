import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowParams, Workflow } from './workflow.types';
import { Step } from '../step/step';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  createWorkflow(@Body() workflow: Workflow) {
    const { id, steps, dependencies } = workflow;
    this.workflowService.createWorkflow(id, steps, dependencies);
    return { message: 'Workflow created successfully' };
  }

  @Put(':id/step')
  addStepToWorkflow(@Param('id') id: string, @Body() step: Step) {
    return this.workflowService.addStepToWorkflow(id, step);
  }

  @Put(':id/dependency')
  addDependencyToStep(@Param('id') id: string, @Body() dependency: { step: Step, dependentStep: Step }) {
    return this.workflowService.addDependencyToStep(id, dependency.step, dependency.dependentStep);
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
