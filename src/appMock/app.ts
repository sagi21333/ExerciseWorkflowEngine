import { v4 as uuidv4 } from 'uuid';
import { WorkflowService } from '../workflow/workflow.service';
import { SendEmailStep } from '../step/send-email-step';
import { OptionGrantStep } from '../step/option-grant-step';
import { mockEmailParams, mockOptionsOne, mockOptionsTwo } from './mock-data';
import { Step } from '../step/step';
import { WorkflowParams } from 'src/workflow/workflow.types';

export async function main() {
  const workflowService = new WorkflowService();

  const sendEmailStep1: Step = {
    id: uuidv4(), // Generate a unique id for the step
    name: 'Send Email 1',
    execute: (params: any) => new SendEmailStep('Send Email 1').execute(params),
    successful: false,
  };

  const sendEmailStep2: Step = {
    id: uuidv4(),
    name: 'Send Email 2',
    execute: (params: any) => new SendEmailStep('Send Email 2').execute(params),
    successful: false,
  };

  const optionGrantStep1: Step = {
    id: uuidv4(),
    name: 'Update Options Grant 1',
    execute: (params: any) => new OptionGrantStep('Update Options Grant 1').execute(params),
    successful: false,
  };

  const optionGrantStep2: Step = {
    id: uuidv4(),
    name: 'Update Options Grant 2',
    execute: (params: any) => new OptionGrantStep('Update Options Grant 2').execute(params),
    successful: false,
  };

  const workflow2 = {
    id: 'workflow2',
    steps: [sendEmailStep1, sendEmailStep2, optionGrantStep1, optionGrantStep2],
    dependencies: new Map<Step, Step[]>(),
  };

  workflow2.dependencies = new Map([
    [optionGrantStep1, [sendEmailStep1]], 
    [optionGrantStep2, [sendEmailStep2]], 
  ]);

  workflowService.addWorkflow(workflow2);

  // Define parameters for workflow 2 execution
  const workflow2Params: WorkflowParams = {
    [sendEmailStep1.id]: mockEmailParams, 
    [sendEmailStep2.id]: mockEmailParams, 
    [optionGrantStep1.id]: mockOptionsOne, 
    [optionGrantStep2.id]: mockOptionsTwo, 
  };

  // Execute workflow 2
  await workflowService.executeWorkflowById('workflow2', workflow2Params);
}

main().catch(console.error);
