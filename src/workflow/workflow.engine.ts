import { Injectable } from '@nestjs/common';
import { Workflow } from './workflow.types';
import { Step } from '../step/step';

@Injectable()
export class Engine {
  async run(workflow: Workflow, params: any) {
    const { steps, dependencies } = workflow;
    const pendingSteps = new Set(steps);
    const stepSuccess = new Map<Step, boolean>();

    if (!(dependencies instanceof Map)) {
      workflow.dependencies = this.convertDependenciesToObject(dependencies, steps);
    }

    await this.runWithoutDependencies(steps, params, workflow.dependencies, pendingSteps, stepSuccess);
    await this.runWithDependencies(pendingSteps, params, workflow.dependencies, stepSuccess);
  }

  private async runWithoutDependencies(
    steps: Step[],
    params: any,
    dependencies: Map<Step, Step[]>,
    pendingSteps: Set<Step>,
    stepSuccess: Map<Step, boolean>
  ) {
    const stepsWithNoDependencies = steps.filter(step => !dependencies.has(step));
    await Promise.all(stepsWithNoDependencies.map(step => this.executeStep(step, params[step.id], dependencies, pendingSteps, stepSuccess)));
  }

  private async runWithDependencies(
    pendingSteps: Set<Step>,
    params: any,
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

  private convertDependenciesToObject(dependencies: Record<string, string[]>, steps: Step[]): Map<Step, Step[]> {
    const dependenciesMap = new Map<Step, Step[]>();

    for (const [dependentStepId, dependsOnSteps] of Object.entries(dependencies)) {
      const dependentStep = steps.find(step => step.id === dependentStepId);
      if (dependentStep) {
        const dependsOnStepObjects = dependsOnSteps.map(depStepId => steps.find(step => step.id === depStepId));
        dependenciesMap.set(dependentStep, dependsOnStepObjects.filter(step => step));
      }
    }

    return dependenciesMap;
  }
}
