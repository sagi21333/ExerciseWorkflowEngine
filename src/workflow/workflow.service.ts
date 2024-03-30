import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
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
    workflow.steps.forEach(step => {
      step.id = uuidv4(); // Generate unique ID for each step
    });
    workflow.dependencies = new Map<Step, Step[]>(); // Initialize dependencies as a Map
    this.workflows.set(workflow.id, workflow);
  }

  addStepToWorkflow(workflowId: string, step: Step) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow with id ${workflowId} not found`);
    }
    workflow.steps.push(step);
  }

  addDependencyToStep(workflowId: string, stepId: string, dependentStepId: string) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
        throw new Error(`Workflow with id ${workflowId} not found`);
    }
    
    const step = workflow.steps.find(s => s.id === stepId);
    const dependentStep = workflow.steps.find(s => s.id === dependentStepId);
    if (!step || !dependentStep) {
        throw new Error(`Step not found in workflow`);
    }

    if (!workflow.dependencies.has(step)) {
        workflow.dependencies.set(step, []);
    }

    const dependencies = workflow.dependencies.get(step);
    dependencies.push(dependentStep);
    
    return workflow;
}


  getWorkflowById(workflowId: string) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow with id ${workflowId} not found`);
    }
    return workflow;
  }

  createWorkflow(id: string, steps: Step[]) {
    const workflow: Workflow = {
      id,
      steps,
      dependencies: new Map<Step, Step[]>(),
    };
    this.addWorkflow(workflow);

    return workflow;
  }
}
