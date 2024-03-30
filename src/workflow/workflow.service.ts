import { Injectable } from '@nestjs/common';
import { Workflow, WorkflowParams } from './workflow.types';
import { Engine } from './workflow.engine';
import { Step } from '../step/step';

@Injectable()
export class WorkflowService {
  private engine: Engine;
  private workflows: Map<string, Workflow>;

  constructor() {
    this.engine = new Engine();
    this.workflows = new Map<string, Workflow>();
  }

  async executeWorkflowById(workflowId: string, params: WorkflowParams) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow with id ${workflowId} not found`);
    }
    await this.engine.run(workflow, params);
  }

  async executeWorkflow(workflow: Workflow, params: WorkflowParams) {
    await this.engine.run(workflow, params);
  }

  addWorkflow(workflow: Workflow) {
    this.workflows.set(workflow.id, workflow);
  }

  addStepToWorkflow(workflowId: string, step: Step) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow with id ${workflowId} not found`);
    }
    workflow.steps.push(step);
  }

  addDependencyToStep(workflowId: string, step: Step, dependentStep: Step) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow with id ${workflowId} not found`);
    }
    const dependencies = workflow.dependencies.get(step) || [];
    dependencies.push(dependentStep);
    workflow.dependencies.set(step, dependencies);
  }

  getWorkflowById(workflowId: string) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow with id ${workflowId} not found`);
    }
    return workflow;
  }

  createWorkflow(id: string, steps: Step[], dependencies: Map<Step, Step[]>) {
    const workflow: Workflow = {
      id,
      steps,
      dependencies,
    };
    this.workflows.set(id, workflow);
  }
}
