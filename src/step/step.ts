// step.ts

export interface Step {
    name: string;
    execute: (params: any) => Promise<boolean>;
    successful: boolean;
  }
  