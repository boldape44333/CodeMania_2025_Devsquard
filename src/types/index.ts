// Task related types
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  subject?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schedule related types
export interface Schedule {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  subject?: string;
  location?: string;
  recurring?: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Deadline related types
export interface Deadline {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  subject?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  reminder?: boolean;
  reminderTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Chat related types
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  attachments?: string[];
}

// Knowledge base related types
export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User settings
export interface UserSettings {
  name: string;
  email?: string;
  darkMode: boolean;
  notifications: boolean;
  reminderTime: number; // minutes before deadline
  preferredSubjects: string[];
}