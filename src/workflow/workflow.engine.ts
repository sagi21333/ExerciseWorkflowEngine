import { Injectable } from '@nestjs/common';
import { Workflow, WorkflowParams, StepParams } from './workflow.types';
import { Step } from '../step/step';

@Injectable()
export class Engine {
  async run(workflow: Workflow, params: WorkflowParams) {
    const { steps, dependencies } = workflow;
    const pendingSteps = new Set(steps);
    const stepSuccess = new Map<Step, boolean>();

    await this.runWithoutDependencies(steps, params, dependencies, pendingSteps, stepSuccess);
    await this.runWithDependencies(pendingSteps, params, dependencies, stepSuccess);
  }

  private async runWithoutDependencies(
    steps: Step[],
    params: WorkflowParams,
    dependencies: Map<Step, Step[]>,
    pendingSteps: Set<Step>,
    stepSuccess: Map<Step, boolean>
  ) {
    const stepsWithNoDependencies = steps.filter(step => !dependencies.has(step));
    await Promise.all(stepsWithNoDependencies.map(step => this.executeStep(step, params[step.id], dependencies, pendingSteps, stepSuccess)));
  }

  private async runWithDependencies(
    pendingSteps: Set<Step>,
    params: WorkflowParams,
    dependencies: Map<Step, Step[]>,
    stepSuccess: Map<Step, boolean>
  ) {
    while (pendingSteps.size > 0) {
      const readySteps = Array.from(pendingSteps).filter(step => {
        const dependentSteps = dependencies.get(step) || [];
        return dependentSteps.every(depStep => stepSuccess.get(depStep));
      });

      await Promise.all(readySteps.map(step => this.executeStep(step, params[step.id], dependencies, pendingSteps, stepSuccess)));
    }
  }

  private async executeStep(
    step: Step,
    stepParams: StepParams,
    dependencies: Map<Step, Step[]>,
    pendingSteps: Set<Step>,
    stepSuccess: Map<Step, boolean>
  ) {
    try {
      console.log(`Executing step: ${step.name}`);
      const success = await step.execute(stepParams);
      step.successful = success;
      stepSuccess.set(step, success);
      console.log(`Step ${step.name} executed ${success ? 'successfully' : 'unsuccessfully'}`);
    } catch (error) {
      console.error(`Step ${step.name} failed:`, error);
      step.successful = false;
      stepSuccess.set(step, false);

      const dependentSteps = dependencies.get(step) || [];
      dependentSteps.forEach(depStep => {
        stepSuccess.set(depStep, false);
        pendingSteps.delete(depStep);
      });
    } finally {
      pendingSteps.delete(step);
    }
  }
}
