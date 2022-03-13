import { PrismaService } from '@api/prisma/prisma.service';
import { User, UserInfo } from '@api/user/decorators/user.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dtos/task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  async getTasks(@User() user: UserInfo) {
    const u = await this.prismaService.user.findFirst({
      where: {
        id: user.id,
      },
    });
    if (u.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.taskService.getTasks();
  }

  @Get(':id')
  async getTask(@Param('id', ParseIntPipe) id: number, @User() user: UserInfo) {
    const u = await this.prismaService.user.findFirst({
      where: {
        id: user.id,
      },
    });
    if (u.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.taskService.getTask(id);
  }

  @Post()
  async createTask(@Body() body: CreateTaskDto, @User() user: UserInfo) {
    return this.taskService.createTask(body, user.id);
  }

  @Put(':id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
    @Body() body: UpdateTaskDto,
  ) {
    const u = await this.prismaService.user.findFirst({
      where: {
        id: user.id,
      },
    });
    if (u.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.taskService.updateTask(body, id);
  }

  @Delete(':id')
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    const u = await this.prismaService.user.findFirst({
      where: {
        id: user.id,
      },
    });
    if (u.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.taskService.deleteTask(id);
  }
}
