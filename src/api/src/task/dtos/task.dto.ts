export class TaskResponseDto {
  id: number;
  title: string;
  body: string;
  completed: boolean;
  user_id: number;

  constructor(partial: Partial<TaskResponseDto>) {
    Object.assign(this, partial);
  }
}
