import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskResponseDto } from './dtos/task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) {}

  async getTasks(): Promise<TaskResponseDto[]> {
    const tasks = await this.prismaService.task.findMany({
      select: {
        id: true,
        body: true,
        completed: true,
        title: true,
      },
    });
    if (!tasks.length) {
      throw new NotFoundException();
    }
    return tasks.map((task) => new TaskResponseDto(task));
  }

  async getTask(id: number) {
    const task = await this.prismaService.task.findUnique({
      select: {
        id: true,
        body: true,
        completed: true,
        title: true,
      },
      where: {
        id,
      },
    });
    return new TaskResponseDto(task);
  }
}
