import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';

const mockTask = [
  {
    id: 1,
    title: 'admin',
    body: 'do the dishes',
  },
];

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
            },
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create a task', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });
});
