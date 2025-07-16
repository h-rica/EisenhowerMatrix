export enum TaskPriority {
  URGENT_IMPORTANT = 'urgent_important', // Do (Green)
  NOT_URGENT_IMPORTANT = 'not_urgent_important', // Schedule (Blue)
  URGENT_NOT_IMPORTANT = 'urgent_not_important', // Delegate (Orange)
  NOT_URGENT_NOT_IMPORTANT = 'not_urgent_not_important', // Delete (Red)
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: Date;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  completed?: boolean;
}