import { Step } from './step';

interface EmailParams {
  recipient?: string;
  subject?: string;
  body?: string;
}

export class SendEmailStep implements Step {
  constructor(public name: string) {}

  private _recipient: string = '';
  private _subject: string = '';
  private _body: string = '';
  private _successful: boolean = false;

  get recipient(): string {
    return this._recipient;
  }

  set recipient(value: string) {
    this._recipient = value;
  }

  get subject(): string {
    return this._subject;
  }

  set subject(value: string) {
    this._subject = value;
  }

  get body(): string {
    return this._body;
  }

  set body(value: string) {
    this._body = value;
  }

  get successful(): boolean {
    return this._successful;
  }

  set successful(value: boolean) {
    this._successful = value;
  }

  async execute(params?: EmailParams): Promise<boolean> {
    const { recipient, subject, body } = params || {
      recipient: this.recipient,
      subject: this.subject,
      body: this.body,
    };

    console.log(`Sending email to ${recipient} with subject: ${subject} and body: ${body}`);
    this.successful = true; 
    return true;
  }
}
