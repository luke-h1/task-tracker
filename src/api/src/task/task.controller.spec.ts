import { PrismaService } from '@api/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '@api/task/task.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskService } from './task.service';

describe('TaskController', () => {
  let service: TaskService;
  let controller: TaskController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
      controllers: [TaskController],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
