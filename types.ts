export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export enum FilterType {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export interface AIGenerationResponse {
  tasks: string[];
}