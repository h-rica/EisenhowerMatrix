import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideCheckCheck, lucideTarget, lucideZap } from '@ng-icons/lucide';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [NgIconComponent],
  providers: [provideIcons({ lucideArrowRight, lucideCheckCheck, lucideTarget, lucideZap })],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <!-- Header -->
      <header class="container mx-auto px-4 py-6">
        <nav class="flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <ng-icon name="lucideTarget" class="text-white" size="20"></ng-icon>
            </div>
            <span class="text-xl font-bold text-gray-800 dark:text-white">Eisenhower Agile</span>
          </div>
          <button 
            (click)="navigateToMatrix()"
            class="btn btn-primary">
            Get Started
            <ng-icon name="lucideArrowRight" size="16"></ng-icon>
          </button>
        </nav>
      </header>

      <!-- Hero Section -->
      <main class="container mx-auto px-4 py-16">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
            Focus on what 
            <span class="text-yellow-500">truly matters</span>
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Eisenhower Agile helps you prioritize your work using the proven Eisenhower Matrix method, 
            enhanced with AI-powered suggestions to streamline your workflow.
          </p>
          <button 
            (click)="navigateToMatrix()"
            class="btn btn-primary btn-lg">
            Start Organizing Tasks
            <ng-icon name="lucideArrowRight" size="20"></ng-icon>
          </button>
        </div>

        <!-- Features Grid -->
        <div class="grid md:grid-cols-3 gap-8 mt-20">
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <ng-icon name="lucideTarget" class="text-green-600 dark:text-green-400" size="32"></ng-icon>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Smart Prioritization</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Organize tasks into four strategic quadrants: Do, Schedule, Delegate, and Eliminate.
            </p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <ng-icon name="lucideZap" class="text-blue-600 dark:text-blue-400" size="32"></ng-icon>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">AI-Powered Suggestions</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Get intelligent recommendations on task prioritization with AI assistance.
            </p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <ng-icon name="lucideCheckCheck" class="text-purple-600 dark:text-purple-400" size="32"></ng-icon>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Drag & Drop Interface</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Seamlessly move tasks between quadrants with an intuitive drag-and-drop interface.
            </p>
          </div>
        </div>

        <!-- Matrix Preview -->
        <div class="mt-20">
          <h2 class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
            The Eisenhower Matrix
          </h2>
          <div class="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div class="bg-green-100 dark:bg-green-900 p-6 rounded-lg border-2 border-green-200 dark:border-green-700">
              <h3 class="font-semibold text-green-800 dark:text-green-200 mb-2">Do First</h3>
              <p class="text-sm text-green-700 dark:text-green-300">Urgent & Important</p>
            </div>
            <div class="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-700">
              <h3 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">Schedule</h3>
              <p class="text-sm text-blue-700 dark:text-blue-300">Important & Not Urgent</p>
            </div>
            <div class="bg-orange-100 dark:bg-orange-900 p-6 rounded-lg border-2 border-orange-200 dark:border-orange-700">
              <h3 class="font-semibold text-orange-800 dark:text-orange-200 mb-2">Delegate</h3>
              <p class="text-sm text-orange-700 dark:text-orange-300">Urgent & Not Important</p>
            </div>
            <div class="bg-red-100 dark:bg-red-900 p-6 rounded-lg border-2 border-red-200 dark:border-red-700">
              <h3 class="font-semibold text-red-800 dark:text-red-200 mb-2">Eliminate</h3>
              <p class="text-sm text-red-700 dark:text-red-300">Not Urgent & Not Important</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class LandingComponent {
  constructor(private router: Router) {}

  navigateToMatrix(): void {
    this.router.navigate(['/matrix']);
  }
}