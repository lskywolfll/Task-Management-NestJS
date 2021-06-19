import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
});

const mockUser = {
  username: 'Ariel',
  id: 'someid',
  password: 'somePassword',
  tasks: [],
};

const mockTask = {
  title: 'test title',
  description: 'test description',
  id: 'someId',
  status: TaskStatus.OPEN,
};

const mockTaskUpdate = {
  ...mockTask,
  status: TaskStatus.DONE,
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    // initialize a nestjs module with taskService and tasksRepository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTAsks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      // mockResolvedValue => la respuesta de la promesa para la funcion
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskByID', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskByID('someId', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskByID('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('CreateTask', () => {
    it('calls TasksRepository.createTask and returns result', async () => {
      tasksRepository.createTask.mockResolvedValue(mockTask);
      const result = await tasksRepository.createTask(mockTask, mockUser);
      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('calls TasksRepository.delete and not return result', async () => {
      tasksRepository.delete.mockResolvedValue({ affected: 1 });
      expect(await tasksService.deleteTask(null, mockUser)).toBeUndefined();
    });

    it('calls TasksRepository.delete and handles an error', async () => {
      tasksRepository.delete.mockResolvedValue({ affected: 0 });
      expect(tasksService.deleteTask(null, mockUser)).rejects.toThrow();
    });
  });

  describe('updateTaskStatus', () => {
    it('calls TasksRepository.save and return task updated', async () => {
      tasksRepository.findOne.mockResolvedValue(mockTask);
      tasksRepository.save.mockResolvedValue(mockTaskUpdate);

      const result = await tasksService.updateTaskStatus(
        null,
        TaskStatus.DONE,
        mockUser,
      );

      expect(result).toEqual(mockTaskUpdate);
    });
  });
});
