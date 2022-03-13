export interface createTaskParams {
  title: string;
  body: string;
  completed: boolean;
}

export interface updateTaskParams {
  title?: string;
  body?: string;
  completed?: boolean;
}
