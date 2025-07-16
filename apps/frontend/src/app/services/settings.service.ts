import { Injectable, signal, effect } from '@angular/core';
import { AppSettings, DEFAULT_SETTINGS } from '../models/settings.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly STORAGE_KEY = 'eisenhower-settings';
  
  settings = signal<AppSettings>(DEFAULT_SETTINGS);

  constructor(private localStorageService: LocalStorageService) {
    this.loadSettings();
    
    // Apply theme changes automatically
    effect(() => {
      this.applyTheme(this.settings().theme);
    });
  }

  private loadSettings(): void {
    const stored = this.localStorageService.get<AppSettings>(this.STORAGE_KEY);
    if (stored) {
      try {
        this.settings.set({ ...DEFAULT_SETTINGS, ...stored });
      } catch (error) {
        console.error('Failed to load settings:', error);
        this.settings.set(DEFAULT_SETTINGS);
      }
    }
  }

  private saveSettings(): void {
    this.localStorageService.set(this.STORAGE_KEY, this.settings());
  }

  updateSettings(partial: Partial<AppSettings>): void {
    this.settings.update(current => ({ ...current, ...partial }));
    this.saveSettings();
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      html.classList.add('dark');
    } else {
      html.setAttribute('data-theme', 'light');
      html.classList.remove('dark');
    }
  }

  toggleTheme(): void {
    const newTheme = this.settings().theme === 'light' ? 'dark' : 'light';
    this.updateSettings({ theme: newTheme });
  }
}