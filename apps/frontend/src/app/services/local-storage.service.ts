import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly localStorage = inject(DOCUMENT)?.defaultView?.localStorage;

  get<T>(key: string): T | null {
    if (!this.localStorage) {
      return null;
    }

    const item = this.localStorage.getItem(key);

    if (!item) {
      return null;
    }

    return this.isJSONValid(item) ? (JSON.parse(item) as T) : (item as T);
  }

  set(key: string, value: unknown): void {
    if (!this.localStorage) {
      return;
    }
    this.localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    if (!this.localStorage) {
      return;
    }
    this.localStorage.removeItem(key);
  }
  
  removeKeys(keys: string[]): void {
    if (!this.localStorage) {
      return;
    }
    keys.forEach(key => this.localStorage?.removeItem(key));
  }

  clear(): void {
    if (!this.localStorage) {
      return;
    }
    this.localStorage.clear();
  }

  private isJSONValid(value: string): boolean {
    try {
      JSON.parse(value);
      return true;
    } catch (error: any) {
      console.error('JSON parsing error:', error.message);
      return false;
    }
  }
}