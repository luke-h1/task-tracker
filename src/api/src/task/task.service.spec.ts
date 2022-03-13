import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';

const mockTask = {
  id: 1,
  title: 'admin',
  body: 'do the dishes',
  completed: false,
};

const mockUpdateTaskData = {
  title: 'admin updated',
  body: 'do the dishes 2',
  completed: true,
};

describe('TaskService', () => {
  let service: TaskService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: {
            task: {
              create: jest.fn().mockReturnValue(mockTask),
              findUnique: jest.fn().mockReturnValue(mockUpdateTaskData),
              update: jest.fn().mockReturnValue(mockUpdateTaskData),
              delete: jest.fn().mockReturnValue({}),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  it('should create a task', async () => {
    const mockPrisma = jest.fn().mockReturnValue(mockTask);
    jest.spyOn(prismaService.task, 'create').mockImplementation(mockPrisma);

    await service.createTask(mockTask, 1);

    expect(mockPrisma).toBeCalledWith({
      data: {
        id: 1,
        ...mockTask,
        user_id: 1,
      },
    });
  });

  it('should update a task', async () => {
    const mockPrisma = jest.fn().mockReturnValue(mockTask);
    jest.spyOn(prismaService.task, 'update').mockImplementation(mockPrisma);
    await service.updateTask(mockTask, 1);
    expect(mockPrisma).toBeCalledWith({
      data: {
        id: 1,
        ...mockTask,
      },
      where: {
        id: 1,
      },
    });
  });

  it('should delete a task', async () => {
    const mockPrisma = jest.fn().mockReturnValue(mockTask);
    jest.spyOn(prismaService.task, 'delete').mockImplementation(mockPrisma);
    await service.deleteTask(1);
    expect(mockPrisma).toBeCalledWith({
      where: {
        id: 1,
      },
    });
  });
});
