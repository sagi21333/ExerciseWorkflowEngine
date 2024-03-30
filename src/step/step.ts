import { v4 as uuidv4 } from 'uuid';

export interface Step {
    id: string;
    name: string;
    execute: (params: any) => Promise<boolean>;
    successful: boolean;
}

export class BaseStep implements Step {
    id: string;
    name: string;
    successful: boolean;

    constructor(name: string) {
        this.id = uuidv4(); 
        this.name = name;
        this.successful = false;
    }

    async execute(params: any): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}
