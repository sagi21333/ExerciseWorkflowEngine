import { Injectable } from '@nestjs/common';
import { Workflow, WorkflowParams } from './workflow.types';
import { Engine } from './workflow.engine';
import { Step } from '../step/step';
import { v4 as uuidv4 } from 'uuid';

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
    step.id = uuidv4(); 
    workflow.steps.push(step);
  }

  addDependencyToStep(workflowId: string, stepId: string, dependentStepId: string) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow with id ${workflowId} not found`);
    }
    const step = workflow.steps.find(step => step.id === stepId);
    const dependentStep = workflow.steps.find(step => step.id === dependentStepId);
    if (!step || !dependentStep) {
      throw new Error(`Step not found in workflow`);
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

  createWorkflow(workflow: Workflow) {
    workflow.steps.forEach(step => {
      step.id = uuidv4(); // Generate unique ID for each step
    });
    this.workflows.set(workflow.id, workflow);
  }
}
