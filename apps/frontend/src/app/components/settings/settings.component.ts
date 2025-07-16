import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsService } from '../../services/settings.service';
import { AppSettings } from '../../models/settings.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideMoon, lucideSun, lucideSparkles } from '@ng-icons/lucide';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  providers: [provideIcons({ lucideArrowLeft, lucideMoon, lucideSun, lucideSparkles })],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center space-x-4">
            <button 
              (click)="goBack()"
              class="btn btn-ghost btn-sm">
              <ng-icon name="lucideArrowLeft" size="16"></ng-icon>
              Back
            </button>
            <h1 class="text-xl font-bold text-gray-800 dark:text-white">Settings</h1>
          </div>
        </div>
      </header>

      <!-- Settings Content -->
      <main class="container mx-auto px-4 py-8 max-w-2xl">
        <div class="space-y-6">
          
          <!-- Theme Settings -->
          <div class="card bg-base-100 shadow-sm">
            <div class="card-body">
              <h2 class="card-title flex items-center">
                <ng-icon [name]="settings().theme === 'dark' ? 'lucideMoon' : 'lucideSun'" size="20"></ng-icon>
                Theme
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Choose your preferred theme for the application.
              </p>
              
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Light Theme</span>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="light"
                    [checked]="settings().theme === 'light'"
                    (change)="updateTheme('light')"
                    class="radio radio-primary">
                </label>
              </div>
              
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Dark Theme</span>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="dark"
                    [checked]="settings().theme === 'dark'"
                    (change)="updateTheme('dark')"
                    class="radio radio-primary">
                </label>
              </div>
            </div>
          </div>

          <!-- AI Provider Settings -->
          <div class="card bg-base-100 shadow-sm">
            <div class="card-body">
              <h2 class="card-title flex items-center">
                <ng-icon name="lucideSparkles" size="20"></ng-icon>
                AI Provider
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Configure your AI provider for task prioritization suggestions.
              </p>
              
              <div class="form-control mb-4">
                <label class="label">
                  <span class="label-text">Provider</span>
                </label>
                <select 
                  [(ngModel)]="currentSettings.aiProvider"
                  (change)="updateSettings()"
                  class="select select-bordered w-full">
                  <option value="gemini">Google Gemini (Default)</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="deepseek">DeepSeek</option>
                  <option value="openrouter">OpenRouter</option>
                </select>
              </div>

              @if (currentSettings.aiProvider !== 'gemini') {
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">API Key</span>
                  </label>
                  <input 
                    type="password" 
                    [(ngModel)]="currentSettings.aiApiKey"
                    (input)="updateSettings()"
                    class="input input-bordered w-full"
                    placeholder="Enter your API key">
                  <label class="label">
                    <span class="label-text-alt text-warning">
                      API key is stored locally in your browser
                    </span>
                  </label>
                </div>
              }
            </div>
          </div>

          <!-- Notification Settings -->
          <div class="card bg-base-100 shadow-sm">
            <div class="card-body">
              <h2 class="card-title">Notifications</h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Manage your notification preferences.
              </p>
              
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Enable notifications</span>
                  <input 
                    type="checkbox" 
                    [(ngModel)]="currentSettings.notifications"
                    (change)="updateSettings()"
                    class="checkbox checkbox-primary">
                </label>
              </div>
            </div>
          </div>

          <!-- Language Settings -->
          <div class="card bg-base-100 shadow-sm">
            <div class="card-body">
              <h2 class="card-title">Language</h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Choose your preferred language.
              </p>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Language</span>
                </label>
                <select 
                  [(ngModel)]="currentSettings.language"
                  (change)="updateSettings()"
                  class="select select-bordered w-full">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Data Management -->
          <div class="card bg-base-100 shadow-sm">
            <div class="card-body">
              <h2 class="card-title">Data Management</h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Manage your local data storage.
              </p>
              
              <div class="flex flex-col sm:flex-row gap-2">
                <button 
                  (click)="exportData()"
                  class="btn btn-outline btn-sm">
                  Export Data
                </button>
                <button 
                  (click)="clearData()"
                  class="btn btn-error btn-outline btn-sm">
                  Clear All Data
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  `
})
export class SettingsComponent {
  currentSettings: AppSettings;
  settingsService = inject(SettingsService);
  router = inject(Router);
  localStorageService = inject(LocalStorageService);

  constructor() {
    this.currentSettings = { ...this.settingsService.settings() };
  }

  settings = this.settingsService.settings;

  updateTheme(theme: 'light' | 'dark'): void {
    this.currentSettings.theme = theme;
    this.updateSettings();
  }

  updateSettings(): void {
    this.settingsService.updateSettings(this.currentSettings);
  }

  goBack(): void {
    this.router.navigate(['/matrix']);
  }

  exportData(): void {
    const data = {
      tasks: this.localStorageService.get('eisenhower-tasks') || [],
      settings: this.localStorageService.get('eisenhower-settings') || {},
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eisenhower-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  clearData(): void {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      this.localStorageService.remove('eisenhower-tasks');
      this.localStorageService.remove('eisenhower-settings');
      location.reload();
    }
  }
}