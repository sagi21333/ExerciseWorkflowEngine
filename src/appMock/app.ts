import { WorkflowService } from '../workflow/workflow.service';
import { SendEmailStep } from '../step/send-email-step';
import { OptionGrantStep } from '../step/option-grant-step';
import { mockEmailParams, mockOptionsOne, mockOptionsTwo } from './mock-data';
import { Step } from '../step/step';
import { WorkflowParams } from 'src/workflow/workflow.types';

export async function main() {
  const workflowService = new WorkflowService();

  const workflow1 = {
    id: 'workflow1',
    steps: [
      new SendEmailStep('Send Email'), 
      new OptionGrantStep('Update Options Grant'), 
    ],
    dependencies: new Map<Step, Step[]>(),
  };

  workflow1.dependencies = new Map([
    [workflow1.steps[1], [workflow1.steps[0]]], 
  ]);

  const workflow2 = {
    id: 'workflow2',
    steps: [
      new SendEmailStep('Send Email 1'), 
      new SendEmailStep('Send Email 2'),
      new OptionGrantStep('Update Options Grant 1'),
      new OptionGrantStep('Update Options Grant 2'),
    ],
    dependencies: new Map<Step, Step[]>(),
  };

  workflow2.dependencies = new Map([
    [workflow2.steps[2], [workflow2.steps[0]]], 
    [workflow2.steps[3], [workflow2.steps[1]]], 
  ]);

  workflowService.addWorkflow(workflow1);
  workflowService.addWorkflow(workflow2);

  const workflow1Params: WorkflowParams = {
    0: { 
      recipient: 'example@example.com',
      subject: 'Test Subject',
      body: 'Test Body',
    },
    1: { 
      id: 123,
      status: 'Approved',
    },
  };
  
  await workflowService.executeWorkflowById('workflow1', workflow1Params);

  // Define parameters for workflow 2 execution
  const workflow2Params: WorkflowParams = {
    0: mockEmailParams, 
    1: mockEmailParams, 
    2: mockOptionsOne, 
    3: mockOptionsTwo, 
  };

  // Execute workflow 2
  await workflowService.executeWorkflowById('workflow2', workflow2Params);
}

main().catch(console.error);
