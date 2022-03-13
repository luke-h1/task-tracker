import { PrismaService } from '@api/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '@api/task/task.controller';
import { TaskService } from './task.service';

const mockUserInfo = {
  firstName: 'john',
  id: 1,
  iat: 123,
  exp: 123,
};

const mockTask = [
  {
    id: 1,
    title: 'test',
    body: 'test',
    completed: false,
  },
];

const mockUpdateTask = [
  {
    id: 1,
    title: 'testing (updated)',
    body: 'test',
    completed: false,
  },
];

describe('TaskController', () => {
  let taskService: TaskService;
  let taskController: TaskController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: {
            findFirst: jest.fn().mockReturnValue(mockUserInfo),
            getTasks: jest.fn().mockReturnValue([]),
            getTask: jest.fn().mockReturnValue(mockTask),
          },
        },
      ],
      controllers: [TaskController],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
    expect(prismaService).toBeDefined();
  });
});
