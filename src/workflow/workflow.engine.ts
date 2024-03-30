import { Injectable } from '@nestjs/common';
import { Workflow } from './workflow.types';
import { Step } from '../step/step';

@Injectable()
export class Engine {
  async run(workflow: Workflow, params: any) {
    const { steps, dependencies } = workflow;
    const pendingSteps = new Set(steps);
    const stepSuccess = new Map<Step, boolean>();

    // Execute steps with no dependencies
    const stepsWithNoDependencies = steps.filter(step => !dependencies.has(step));
    await Promise.all(stepsWithNoDependencies.map((step, index) => this.executeStep(step, params[index], dependencies, pendingSteps, stepSuccess)));

    // Execute steps with dependencies
    while (pendingSteps.size > 0) {
      const readySteps = Array.from(pendingSteps).filter(step => {
        const dependentSteps = dependencies.get(step) || [];
        return dependentSteps.every(depStep => stepSuccess.get(depStep));
      });

      await Promise.all(readySteps.map((step, index) => this.executeStep(step, params[index], dependencies, pendingSteps, stepSuccess)));
    }
  }

  private async executeStep(
    step: Step,
    stepParams: any,
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
