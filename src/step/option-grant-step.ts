import { Step } from './step';

interface OptionsParams {
  id?: number;
  status?: string;
}

export class OptionGrantStep implements Step {
  constructor(public name: string) {}

  private _id: number = 0;
  private _status: string = '';
  private _successful: boolean = false;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get successful(): boolean {
    return this._successful;
  }

  set successful(value: boolean) {
    this._successful = value;
  }

  async execute(params?: OptionsParams): Promise<boolean> {
    const { id = this.id, status = this.status } = params || {};

    console.log(`Updating grant of options with ID ${id} and status ${status}`);
    this.successful = true; 
    return true;
}
}
