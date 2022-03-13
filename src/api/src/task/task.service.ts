import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskResponseDto } from './dtos/task.dto';
import { createTaskParams } from './params/task.param';
import { updateTaskParams } from '../../dist/task/params/task.param';

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

  async createTask(body: createTaskParams, userId: number) {
    const task = await this.prismaService.task.create({
      data: {
        ...body,
        user_id: userId,
      },
    });
    return new TaskResponseDto(task);
  }

  async updateTask(body: updateTaskParams, id: number) {
    const task = await this.prismaService.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException();
    }
    const updatedTask = await this.prismaService.task.update({
      where: { id },
      data: body,
    });
    return new TaskResponseDto(updatedTask);
  }

  async deleteTask(id: number) {
    const task = await this.prismaService.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException();
    }
    await this.prismaService.task.delete({
      where: { id },
    });
  }
}
