import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskPriority, CreateTaskRequest } from '../../models/task.model';
import { AIService, AISuggestion } from '../../services/ai.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideX, lucideSparkles, lucideLoader } from '@ng-icons/lucide';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  providers: [provideIcons({ lucideX, lucideSparkles, lucideLoader })],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 dialog-backdrop">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto dialog-content animate-scale-in">
        <!-- Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
            {{ task ? 'Edit Task' : 'Create New Task' }}
          </h2>
          <button 
            (click)="onClose()"
            class="btn btn-ghost btn-sm">
            <ng-icon name="lucideX" size="16"></ng-icon>
          </button>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSave()" class="p-6 space-y-4">
          <!-- Title -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Title *</span>
            </label>
            <input 
              type="text" 
              [(ngModel)]="formData.title"
              name="title"
              class="input input-bordered w-full"
              placeholder="Enter task title"
              required>
          </div>

          <!-- Description -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Description</span>
            </label>
            <textarea 
              [(ngModel)]="formData.description"
              name="description"
              class="textarea textarea-bordered w-full"
              placeholder="Enter task description"
              rows="3"></textarea>
          </div>

          <!-- AI Suggestion -->
          @if (!task) {
            <div class="form-control">
              <button 
                type="button"
                (click)="getAISuggestion()"
                [disabled]="!formData.title || aiLoading()"
                class="btn btn-outline btn-sm">
                @if (aiLoading()) {
                  <ng-icon name="lucideLoader" size="16" class="animate-spin"></ng-icon>
                } @else {
                  <ng-icon name="lucideSparkles" size="16"></ng-icon>
                }
                Get AI Suggestion
              </button>
              
              @if (aiSuggestion()) {
                <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-blue-800 dark:text-blue-200">AI Suggestion</span>
                    <span class="badge badge-info badge-sm">{{ (aiSuggestion()!.confidence * 100).toFixed(0) }}% confident</span>
                  </div>
                  <p class="text-sm text-blue-700 dark:text-blue-300 mb-2">
                    {{ aiSuggestion()!.reasoning }}
                  </p>
                  <button 
                    type="button"
                    (click)="applySuggestion()"
                    class="btn btn-info btn-xs">
                    Apply Suggestion: {{ getPriorityLabel(aiSuggestion()!.suggestedPriority) }}
                  </button>
                </div>
              }
            </div>
          }

          <!-- Priority -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Priority *</span>
            </label>
            <select 
              [(ngModel)]="formData.priority"
              name="priority"
              class="select select-bordered w-full"
              required>
              <option value="{{ TaskPriority.URGENT_IMPORTANT }}">Do First (Urgent & Important)</option>
              <option value="{{ TaskPriority.NOT_URGENT_IMPORTANT }}">Schedule (Important & Not Urgent)</option>
              <option value="{{ TaskPriority.URGENT_NOT_IMPORTANT }}">Delegate (Urgent & Not Important)</option>
              <option value="{{ TaskPriority.NOT_URGENT_NOT_IMPORTANT }}">Eliminate (Not Urgent & Not Important)</option>
            </select>
          </div>

          <!-- Due Date -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Due Date</span>
            </label>
            <input 
              type="datetime-local" 
              [(ngModel)]="dueDateString"
              name="dueDate"
              class="input input-bordered w-full">
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-2 pt-4">
            <button 
              type="button"
              (click)="onClose()"
              class="btn btn-ghost">
              Cancel
            </button>
            <button 
              type="submit"
              [disabled]="!formData.title"
              class="btn btn-primary">
              {{ task ? 'Update' : 'Create' }} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class TaskDialogComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() save = new EventEmitter<CreateTaskRequest>();
  @Output() close = new EventEmitter<void>();

  TaskPriority = TaskPriority;

  formData: CreateTaskRequest = {
    title: '',
    description: '',
    priority: TaskPriority.NOT_URGENT_IMPORTANT,
  };

  dueDateString = '';
  aiLoading = signal(false);
  aiSuggestion = signal<AISuggestion | null>(null);

  constructor(private aiService: AIService) { }

  ngOnInit(): void {
    if (this.task) {
      this.formData = {
        title: this.task.title,
        description: this.task.description,
        priority: this.task.priority,
        dueDate: this.task.dueDate,
      };

      if (this.task.dueDate) {
        this.dueDateString = this.formatDateForInput(this.task.dueDate);
      }
    }
  }

  async getAISuggestion(): Promise<void> {
    if (!this.formData.title) return;

    this.aiLoading.set(true);
    try {
      const suggestion = await this.aiService.suggestTaskPriority(
        this.formData.title,
        this.formData.description
      );
      this.aiSuggestion.set(suggestion);
    } catch (error) {
      console.error('Failed to get AI suggestion:', error);
    } finally {
      this.aiLoading.set(false);
    }
  }

  applySuggestion(): void {
    const suggestion = this.aiSuggestion();
    if (suggestion) {
      this.formData.priority = suggestion.suggestedPriority;
    }
  }

  onSave(): void {
    const taskData: CreateTaskRequest = {
      ...this.formData,
      dueDate: this.dueDateString ? new Date(this.dueDateString) : undefined,
    };

    this.save.emit(taskData);
  }

  onClose(): void {
    this.close.emit();
  }

  getPriorityLabel(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.URGENT_IMPORTANT:
        return 'Do First';
      case TaskPriority.NOT_URGENT_IMPORTANT:
        return 'Schedule';
      case TaskPriority.URGENT_NOT_IMPORTANT:
        return 'Delegate';
      case TaskPriority.NOT_URGENT_NOT_IMPORTANT:
        return 'Eliminate';
      default:
        return 'Unknown';
    }
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}