
import { GrantOptions } from '../grant-options/grant-options.model';

export const mockOptionsOne: GrantOptions = new GrantOptions(1, 'Pending');
export const mockOptionsTwo: GrantOptions = new GrantOptions(2, 'Checked');
export const mockEmailParams = {
  recipient: 'example@example.com',
  subject: 'Test Email',
  body: 'This is a test email.',
};