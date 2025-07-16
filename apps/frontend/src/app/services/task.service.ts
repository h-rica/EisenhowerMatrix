import { Injectable, signal } from '@angular/core';
import { Task, TaskPriority, CreateTaskRequest, UpdateTaskRequest } from '../models/task.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'eisenhower-tasks';
  
  // Signal for reactive state management
  tasks = signal<Task[]>([]);

  constructor(private localStorageService: LocalStorageService) {
    this.loadTasks();
  }

  private loadTasks(): void {
    const stored = this.localStorageService.get<Task[]>(this.STORAGE_KEY);
    if (stored && Array.isArray(stored)) {
      const tasks = stored.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
      this.tasks.set(tasks);
    } else {
      // Load mock data for demonstration
      this.loadMockData();
    }
  }

  private saveTasks(): void {
    this.localStorageService.set(this.STORAGE_KEY, this.tasks());
  }

  private loadMockData(): void {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Fix critical production bug',
        description: 'Server is down, users cannot access the application',
        priority: TaskPriority.URGENT_IMPORTANT,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      },
      {
        id: '2',
        title: 'Plan quarterly roadmap',
        description: 'Strategic planning for next quarter deliverables',
        priority: TaskPriority.NOT_URGENT_IMPORTANT,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      },
      {
        id: '3',
        title: 'Respond to client emails',
        description: 'Daily email responses and follow-ups',
        priority: TaskPriority.URGENT_NOT_IMPORTANT,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        title: 'Organize desk workspace',
        description: 'Clean and organize physical workspace',
        priority: TaskPriority.NOT_URGENT_NOT_IMPORTANT,
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5',
        title: 'Review security audit',
        description: 'Important security review for compliance',
        priority: TaskPriority.NOT_URGENT_IMPORTANT,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    this.tasks.set(mockTasks);
    this.saveTasks();
  }

  createTask(request: CreateTaskRequest): Task {
    const task: Task = {
      id: crypto.randomUUID(),
      ...request,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.tasks.update(tasks => [...tasks, task]);
    this.saveTasks();
    return task;
  }

  updateTask(id: string, request: UpdateTaskRequest): Task | null {
    const taskIndex = this.tasks().findIndex(t => t.id === id);
    if (taskIndex === -1) return null;

    const updatedTask = {
      ...this.tasks()[taskIndex],
      ...request,
      updatedAt: new Date(),
    };

    this.tasks.update(tasks => {
      const newTasks = [...tasks];
      newTasks[taskIndex] = updatedTask;
      return newTasks;
    });
    
    this.saveTasks();
    return updatedTask;
  }

  deleteTask(id: string): boolean {
    const initialLength = this.tasks().length;
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
    
    if (this.tasks().length < initialLength) {
      this.saveTasks();
      return true;
    }
    return false;
  }

  getTasksByPriority(priority: TaskPriority): Task[] {
    return this.tasks().filter(task => task.priority === priority);
  }

  moveTask(taskId: string, newPriority: TaskPriority): Task | null {
    return this.updateTask(taskId, { priority: newPriority });
  }

  toggleTaskCompletion(id: string): Task | null {
    const task = this.tasks().find(t => t.id === id);
    if (!task) return null;
    
    return this.updateTask(id, { completed: !task.completed });
  }
}