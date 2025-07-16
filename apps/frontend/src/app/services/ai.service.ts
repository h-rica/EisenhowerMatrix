import { Injectable } from '@angular/core';
import { TaskPriority } from '../models/task.model';

export interface AISuggestion {
  suggestedPriority: TaskPriority;
  reasoning: string;
  confidence: number;
}

@Injectable({
  providedIn: 'root'
})
export class AIService {
  
  async suggestTaskPriority(title: string, description?: string): Promise<AISuggestion> {
    // Mock AI suggestion for now - in a real app, this would call Genkit/Gemini API
    return new Promise((resolve) => {
      setTimeout(() => {
        const suggestion = this.mockAISuggestion(title, description);
        resolve(suggestion);
      }, 1000); // Simulate API delay
    });
  }

  private mockAISuggestion(title: string, description?: string): AISuggestion {
    const text = `${title} ${description || ''}`.toLowerCase();
    
    // Simple keyword-based mock logic
    const urgentKeywords = ['urgent', 'asap', 'emergency', 'critical', 'bug', 'down', 'broken', 'deadline'];
    const importantKeywords = ['important', 'strategic', 'plan', 'review', 'security', 'compliance', 'roadmap'];
    const delegateKeywords = ['email', 'meeting', 'call', 'respond', 'follow-up', 'coordinate'];
    const eliminateKeywords = ['organize', 'clean', 'sort', 'browse', 'social', 'entertainment'];

    const isUrgent = urgentKeywords.some(keyword => text.includes(keyword));
    const isImportant = importantKeywords.some(keyword => text.includes(keyword));
    const isDelegate = delegateKeywords.some(keyword => text.includes(keyword));
    const isEliminate = eliminateKeywords.some(keyword => text.includes(keyword));

    let suggestedPriority: TaskPriority;
    let reasoning: string;
    let confidence: number;

    if (isUrgent && isImportant) {
      suggestedPriority = TaskPriority.URGENT_IMPORTANT;
      reasoning = "This task appears to be both urgent and important based on keywords like 'critical', 'urgent', or 'deadline'. It should be done immediately.";
      confidence = 0.9;
    } else if (isImportant && !isUrgent) {
      suggestedPriority = TaskPriority.NOT_URGENT_IMPORTANT;
      reasoning = "This task seems important for long-term goals but not urgent. Schedule it for focused work time.";
      confidence = 0.8;
    } else if (isUrgent && !isImportant) {
      suggestedPriority = TaskPriority.URGENT_NOT_IMPORTANT;
      reasoning = "This task appears urgent but may not be important. Consider delegating it if possible.";
      confidence = 0.7;
    } else if (isDelegate) {
      suggestedPriority = TaskPriority.URGENT_NOT_IMPORTANT;
      reasoning = "This task involves communication or coordination that could potentially be delegated.";
      confidence = 0.6;
    } else if (isEliminate) {
      suggestedPriority = TaskPriority.NOT_URGENT_NOT_IMPORTANT;
      reasoning = "This task appears to be neither urgent nor important. Consider if it's necessary or can be eliminated.";
      confidence = 0.8;
    } else {
      // Default suggestion
      suggestedPriority = TaskPriority.NOT_URGENT_IMPORTANT;
      reasoning = "Based on the task description, this seems like a general task that's important but not urgent. Schedule it appropriately.";
      confidence = 0.5;
    }

    return {
      suggestedPriority,
      reasoning,
      confidence
    };
  }
}