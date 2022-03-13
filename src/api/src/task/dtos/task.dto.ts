import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsBoolean()
  completed: boolean;
}

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  body?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
