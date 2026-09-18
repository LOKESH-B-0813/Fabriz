export type Priority = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
export type Recurrence = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

export type TaskEventType =
  | 'CREATED'
  | 'OPENED'
  | 'POSTPONED'
  | 'COMPLETED'
  | 'REOPENED'
  | 'RESCHEDULED'
  | 'ARCHIVED';

export interface TaskEvent {
  id: string;
  type: TaskEventType;
  timestamp: number;
  note?: string;
  previousDueAt?: number;
  newDueAt?: number;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  dueAt: number | null;
  completedAt: number | null;
  reminderAt: number | null;
  priority: Priority;
  recurrence: Recurrence;
  completed: boolean;
  archived: boolean;
  postponedCount: number;
  totalPostponementDuration: number; // ms
  lastPostponedAt: number | null;
  lastCompletedAt: number | null;
  attemptCount: number;
  lastOpenedAt: number | null;
  history: TaskEvent[];
}

export type TaskFilter = 'TODAY' | 'UPCOMING' | 'OVERDUE' | 'COMPLETED' | 'POSTPONED';

export interface GlobalInsightsSummary {
  completedCount: number;
  activeCount: number;
  overdueCount: number;
  repeatedlyPostponedCount: number;
  mostPostponedTasks: Task[];
  patterns: string[];
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  imageReferences: string[];
  createdAt: number;
  updatedAt: number;
  archived: boolean;
}

export interface VaultEntry {
  id: string;
  userId: string;
  websiteName: string;
  websiteUrl: string;
  username: string;
  encryptedPassword: {
    cipherText: string;
    iv: string;
  };
  plainPassword?: string;
  createdAt: number;
  updatedAt: number;
}

