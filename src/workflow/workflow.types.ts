import { Step } from '../step/step';

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

export interface Workflow {
  id: string;
  steps: Step[];
  dependencies: Map<Step, Step[]>;
}

export type WorkflowParams = {
  [index: number]: StepParams[keyof StepParams]; 
};
