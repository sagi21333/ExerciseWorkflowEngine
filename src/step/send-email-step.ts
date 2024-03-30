import { BaseStep } from './step';

interface EmailParams {
  recipient?: string;
  subject?: string;
  body?: string;
}

export class SendEmailStep extends BaseStep {
  recipient: string;
  subject: string;
  body: string;
  constructor(public name: string) {
    super(name);
  }

  async execute(params?: EmailParams): Promise<boolean> {
    const { recipient = this.recipient, subject = this.subject, body = this.body } = params || {};

    console.log(`Sending email to ${recipient} with subject: ${subject} and body: ${body}`);
    this.successful = true; 
    return true;
  }
}