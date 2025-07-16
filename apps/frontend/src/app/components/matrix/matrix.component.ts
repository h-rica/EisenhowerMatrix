import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task, TaskPriority } from '../../models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideSettings } from '@ng-icons/lucide';
import { Router } from '@angular/router';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-matrix',
  standalone: true,
  imports: [CommonModule, TaskCardComponent, TaskDialogComponent, NgIconComponent, CdkDropList, CdkDrag],
  providers: [provideIcons({ lucidePlus, lucideSettings })],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="container mx-auto px-4 py-4">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">E</span>
              </div>
              <h1 class="text-xl font-bold text-gray-800 dark:text-white">Eisenhower Matrix</h1>
            </div>
            <div class="flex items-center space-x-2">
              <button 
                (click)="openTaskDialog()"
                class="btn btn-primary btn-sm">
                <ng-icon name="lucidePlus" size="16"></ng-icon>
                Add Task
              </button>
              <button 
                (click)="navigateToSettings()"
                class="btn btn-ghost btn-sm">
                <ng-icon name="lucideSettings" size="16"></ng-icon>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Matrix Grid -->
      <main class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]" 
             cdkDropListGroup>
          <!-- Do First (Urgent & Important) -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-green-200 dark:border-green-700 p-4 transition-all duration-300 hover:shadow-lg">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-lg font-semibold text-green-800 dark:text-green-200">Do First</h2>
                <p class="text-sm text-green-600 dark:text-green-400">Urgent & Important</p>
              </div>
              <span class="badge badge-success animate-pulse">{{ urgentImportantTasks().length }}</span>
            </div>
            <div 
              class="space-y-3 max-h-96 overflow-y-auto min-h-[200px] p-2 rounded-lg transition-colors duration-200"
              cdkDropList
              [cdkDropListData]="urgentImportantTasks()"
              (cdkDropListDropped)="drop($event, 'urgent_important')">
              @for (task of urgentImportantTasks(); track task.id) {
                <div cdkDrag class="animate-fade-in">
                  <app-task-card 
                    [task]="task"
                    (edit)="editTask($event)"
                    (delete)="deleteTask($event)"
                    (toggleComplete)="toggleComplete($event)"
                    (priorityChange)="moveTask($event.taskId, $event.priority)">
                  </app-task-card>
                  <div class="cdk-drag-placeholder opacity-50 bg-green-100 dark:bg-green-900 rounded-lg h-20 border-2 border-dashed border-green-300 dark:border-green-600"></div>
                </div>
              }
              @empty {
                <div class="text-center py-8 text-gray-500 dark:text-gray-400 animate-fade-in">
                  <p>Drop urgent and important tasks here</p>
                </div>
              }
            </div>
          </div>

          <!-- Schedule (Important & Not Urgent) -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-blue-200 dark:border-blue-700 p-4 transition-all duration-300 hover:shadow-lg">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-lg font-semibold text-blue-800 dark:text-blue-200">Schedule</h2>
                <p class="text-sm text-blue-600 dark:text-blue-400">Important & Not Urgent</p>
              </div>
              <span class="badge badge-info animate-pulse">{{ notUrgentImportantTasks().length }}</span>
            </div>
            <div 
              class="space-y-3 max-h-96 overflow-y-auto min-h-[200px] p-2 rounded-lg transition-colors duration-200"
              cdkDropList
              [cdkDropListData]="notUrgentImportantTasks()"
              (cdkDropListDropped)="drop($event, 'not_urgent_important')">
              @for (task of notUrgentImportantTasks(); track task.id) {
                <div cdkDrag class="animate-fade-in">
                  <app-task-card 
                    [task]="task"
                    (edit)="editTask($event)"
                    (delete)="deleteTask($event)"
                    (toggleComplete)="toggleComplete($event)"
                    (priorityChange)="moveTask($event.taskId, $event.priority)">
                  </app-task-card>
                  <div class="cdk-drag-placeholder opacity-50 bg-blue-100 dark:bg-blue-900 rounded-lg h-20 border-2 border-dashed border-blue-300 dark:border-blue-600"></div>
                </div>
              }
              @empty {
                <div class="text-center py-8 text-gray-500 dark:text-gray-400 animate-fade-in">
                  <p>Drop important tasks to schedule here</p>
                </div>
              }
            </div>
          </div>

          <!-- Delegate (Urgent & Not Important) -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-orange-200 dark:border-orange-700 p-4 transition-all duration-300 hover:shadow-lg">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-lg font-semibold text-orange-800 dark:text-orange-200">Delegate</h2>
                <p class="text-sm text-orange-600 dark:text-orange-400">Urgent & Not Important</p>
              </div>
              <span class="badge badge-warning animate-pulse">{{ urgentNotImportantTasks().length }}</span>
            </div>
            <div 
              class="space-y-3 max-h-96 overflow-y-auto min-h-[200px] p-2 rounded-lg transition-colors duration-200"
              cdkDropList
              [cdkDropListData]="urgentNotImportantTasks()"
              (cdkDropListDropped)="drop($event, 'urgent_not_important')">
              @for (task of urgentNotImportantTasks(); track task.id) {
                <div cdkDrag class="animate-fade-in">
                  <app-task-card 
                    [task]="task"
                    (edit)="editTask($event)"
                    (delete)="deleteTask($event)"
                    (toggleComplete)="toggleComplete($event)"
                    (priorityChange)="moveTask($event.taskId, $event.priority)">
                  </app-task-card>
                  <div class="cdk-drag-placeholder opacity-50 bg-orange-100 dark:bg-orange-900 rounded-lg h-20 border-2 border-dashed border-orange-300 dark:border-orange-600"></div>
                </div>
              }
              @empty {
                <div class="text-center py-8 text-gray-500 dark:text-gray-400 animate-fade-in">
                  <p>Drop tasks to delegate here</p>
                </div>
              }
            </div>
          </div>

          <!-- Eliminate (Not Urgent & Not Important) -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-red-200 dark:border-red-700 p-4 transition-all duration-300 hover:shadow-lg">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-lg font-semibold text-red-800 dark:text-red-200">Eliminate</h2>
                <p class="text-sm text-red-600 dark:text-red-400">Not Urgent & Not Important</p>
              </div>
              <span class="badge badge-error animate-pulse">{{ notUrgentNotImportantTasks().length }}</span>
            </div>
            <div 
              class="space-y-3 max-h-96 overflow-y-auto min-h-[200px] p-2 rounded-lg transition-colors duration-200"
              cdkDropList
              [cdkDropListData]="notUrgentNotImportantTasks()"
              (cdkDropListDropped)="drop($event, 'not_urgent_not_important')">
              @for (task of notUrgentNotImportantTasks(); track task.id) {
                <div cdkDrag class="animate-fade-in">
                  <app-task-card 
                    [task]="task"
                    (edit)="editTask($event)"
                    (delete)="deleteTask($event)"
                    (toggleComplete)="toggleComplete($event)"
                    (priorityChange)="moveTask($event.taskId, $event.priority)">
                  </app-task-card>
                  <div class="cdk-drag-placeholder opacity-50 bg-red-100 dark:bg-red-900 rounded-lg h-20 border-2 border-dashed border-red-300 dark:border-red-600"></div>
                </div>
              }
              @empty {
                <div class="text-center py-8 text-gray-500 dark:text-gray-400 animate-fade-in">
                  <p>Drop tasks to eliminate here</p>
                </div>
              }
            </div>
          </div>
        </div>
      </main>

      <!-- Task Dialog -->
      @if (showTaskDialog()) {
        <app-task-dialog
          [task]="selectedTask()"
          (save)="saveTask($event)"
          (close)="closeTaskDialog()">
        </app-task-dialog>
      }
    </div>
  `
})
export class MatrixComponent {
  showTaskDialog = signal(false);
  selectedTask = signal<Task | null>(null);

  // Computed signals for each quadrant
  urgentImportantTasks = computed(() => 
    this.taskService.getTasksByPriority(TaskPriority.URGENT_IMPORTANT)
  );
  
  notUrgentImportantTasks = computed(() => 
    this.taskService.getTasksByPriority(TaskPriority.NOT_URGENT_IMPORTANT)
  );
  
  urgentNotImportantTasks = computed(() => 
    this.taskService.getTasksByPriority(TaskPriority.URGENT_NOT_IMPORTANT)
  );
  
  notUrgentNotImportantTasks = computed(() => 
    this.taskService.getTasksByPriority(TaskPriority.NOT_URGENT_NOT_IMPORTANT)
  );

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  openTaskDialog(): void {
    this.selectedTask.set(null);
    this.showTaskDialog.set(true);
  }

  editTask(task: Task): void {
    this.selectedTask.set(task);
    this.showTaskDialog.set(true);
  }

  closeTaskDialog(): void {
    this.showTaskDialog.set(false);
    this.selectedTask.set(null);
  }

  saveTask(taskData: unknown): void {
    if (this.selectedTask()) {
      // Update existing task
      this.taskService.updateTask(this.selectedTask()!.id, taskData);
    } else {
      // Create new task
      this.taskService.createTask(taskData);
    }
    this.closeTaskDialog();
  }

  deleteTask(task: Task): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(task.id);
    }
  }

  toggleComplete(task: Task): void {
    this.taskService.toggleTaskCompletion(task.id);
  }

  moveTask(taskId: string, priority: TaskPriority): void {
    this.taskService.moveTask(taskId, priority);
  }

  navigateToSettings(): void {
    this.router.navigate(['/settings']);
  }

  drop(event: CdkDragDrop<Task[]>, targetPriority: string): void {
    const priority = targetPriority as TaskPriority;
    
    if (event.previousContainer === event.container) {
      // Reordering within the same container
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Moving between containers
      const task = event.previousContainer.data[event.previousIndex];
      
      // Update task priority
      this.taskService.moveTask(task.id, priority);
      
      // Transfer the item between arrays
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}