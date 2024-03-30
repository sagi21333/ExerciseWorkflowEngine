import { Step } from '../step/step';

// Define the parameters for each step type
export type StepParams = {
  'email': {
    recipient: string;
    subject: string;
    body: string;
  };
  'optionGrant': {
    id: number;
    status: string;
  };
};

// Define the workflow type
export interface Workflow {
  id: string;
  steps: Step[];
  dependencies: Map<Step, Step[]>;
}

// Define the type for workflow parameters
export type WorkflowParams = {
  [index: number]: StepParams[keyof StepParams]; // Associating parameters based on step order
};
