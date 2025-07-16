import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskPriority } from '../../models/task.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucidePen, lucideTrash2, lucideCheck, lucideCalendar, lucideClock } from '@ng-icons/lucide';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ lucidePen, lucideTrash2, lucideCheck, lucideCalendar, lucideClock })],
  template: `
    <div class="card bg-base-100 shadow-sm border border-gray-200 dark:border-gray-700 task-card animate-fade-in"
         [class.opacity-60]="task.completed">
      <div class="card-body p-4">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-medium text-gray-800 dark:text-white"
                [class.line-through]="task.completed">
              {{ task.title }}
            </h3>
            @if (task.description) {
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1"
                 [class.line-through]="task.completed">
                {{ task.description }}
              </p>
            }
            
            <!-- Due Date -->
            @if (task.dueDate) {
              <div class="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                <ng-icon name="lucideCalendar" size="12" class="mr-1"></ng-icon>
                <span>{{ formatDate(task.dueDate) }}</span>
                @if (isOverdue(task.dueDate)) {
                  <span class="ml-2 badge badge-error badge-xs">Overdue</span>
                }
              </div>
            }
          </div>
          
          <!-- Actions -->
          <div class="flex items-center space-x-1 ml-2">
            <button 
              (click)="onToggleComplete()"
              class="btn btn-ghost btn-xs"
              [class.btn-success]="task.completed"
              title="Toggle completion">
              <ng-icon name="lucideCheck" size="14"></ng-icon>
            </button>
            <button 
              (click)="onEdit()"
              class="btn btn-ghost btn-xs"
              title="Edit task">
              <ng-icon name="lucidePen" size="14"></ng-icon>
            </button>
            <button 
              (click)="onDelete()"
              class="btn btn-ghost btn-xs text-error hover:bg-error hover:text-white"
              title="Delete task">
              <ng-icon name="lucideTrash2" size="14"></ng-icon>
            </button>
          </div>
        </div>

        <!-- Priority Change Buttons -->
        <div class="flex flex-wrap gap-1 mt-3">
          @if (task.priority !== TaskPriority.URGENT_IMPORTANT) {
            <button 
              (click)="changePriority(TaskPriority.URGENT_IMPORTANT)"
              class="badge badge-success badge-sm cursor-pointer hover:badge-outline">
              Do
            </button>
          }
          @if (task.priority !== TaskPriority.NOT_URGENT_IMPORTANT) {
            <button 
              (click)="changePriority(TaskPriority.NOT_URGENT_IMPORTANT)"
              class="badge badge-info badge-sm cursor-pointer hover:badge-outline">
              Schedule
            </button>
          }
          @if (task.priority !== TaskPriority.URGENT_NOT_IMPORTANT) {
            <button 
              (click)="changePriority(TaskPriority.URGENT_NOT_IMPORTANT)"
              class="badge badge-warning badge-sm cursor-pointer hover:badge-outline">
              Delegate
            </button>
          }
          @if (task.priority !== TaskPriority.NOT_URGENT_NOT_IMPORTANT) {
            <button 
              (click)="changePriority(TaskPriority.NOT_URGENT_NOT_IMPORTANT)"
              class="badge badge-error badge-sm cursor-pointer hover:badge-outline">
              Eliminate
            </button>
          }
        </div>
      </div>
    </div>
  `
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();
  @Output() toggleComplete = new EventEmitter<Task>();
  @Output() priorityChange = new EventEmitter<{ taskId: string; priority: TaskPriority }>();

  TaskPriority = TaskPriority;

  onEdit(): void {
    this.edit.emit(this.task);
  }

  onDelete(): void {
    this.delete.emit(this.task);
  }

  onToggleComplete(): void {
    this.toggleComplete.emit(this.task);
  }

  changePriority(priority: TaskPriority): void {
    this.priorityChange.emit({ taskId: this.task.id, priority });
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  isOverdue(dueDate: Date): boolean {
    return new Date() > dueDate;
  }
}