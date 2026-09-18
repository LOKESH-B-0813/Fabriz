import { Task } from '../types';

const now = Date.now();
const dayMs = 24 * 60 * 60 * 1000;

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    userId: 'user-demo',
    title: 'Finish project report',
    description: 'Compile quarterly engineering milestones and budget reconciliation.',
    createdAt: now - 3 * dayMs,
    updatedAt: now,
    dueAt: now + 4 * 60 * 60 * 1000, // Due 6:00 PM today
    completedAt: null,
    reminderAt: now + 3 * 60 * 60 * 1000,
    priority: 'MEDIUM',
    recurrence: 'NONE',
    completed: false,
    archived: false,
    postponedCount: 1,
    totalPostponementDuration: 2 * dayMs,
    lastPostponedAt: now - 2 * dayMs,
    lastCompletedAt: null,
    attemptCount: 1,
    lastOpenedAt: now - 1 * dayMs,
    history: [
      {
        id: 'ev-1',
        type: 'CREATED',
        timestamp: now - 3 * dayMs,
        note: 'Created initial draft'
      },
      {
        id: 'ev-2',
        type: 'POSTPONED',
        timestamp: now - 2 * dayMs,
        note: 'Delayed: waiting on financial data',
        previousDueAt: now - 2 * dayMs,
        newDueAt: now + 4 * 60 * 60 * 1000
      }
    ]
  },
  {
    id: 'task-2',
    userId: 'user-demo',
    title: 'Study Linux Networking',
    description: 'Master iptables packet flow, network namespaces, and socket diagnostics.',
    createdAt: now - 15 * dayMs,
    updatedAt: now,
    dueAt: now + 6 * 60 * 60 * 1000, // Due 8:00 PM today
    completedAt: null,
    reminderAt: now + 5 * 60 * 60 * 1000,
    priority: 'HIGH',
    recurrence: 'NONE',
    completed: false,
    archived: false,
    postponedCount: 3,
    totalPostponementDuration: 12 * dayMs,
    lastPostponedAt: now - 1 * dayMs,
    lastCompletedAt: null,
    attemptCount: 3,
    lastOpenedAt: now - 1 * dayMs,
    history: [
      {
        id: 'ev-20',
        type: 'CREATED',
        timestamp: now - 15 * dayMs,
        note: 'Set goal to complete chapter 4'
      },
      {
        id: 'ev-21',
        type: 'POSTPONED',
        timestamp: now - 10 * dayMs,
        note: 'Postponed to weekend',
        previousDueAt: now - 10 * dayMs,
        newDueAt: now - 7 * dayMs
      },
      {
        id: 'ev-22',
        type: 'OPENED',
        timestamp: now - 7 * dayMs
      },
      {
        id: 'ev-23',
        type: 'POSTPONED',
        timestamp: now - 6 * dayMs,
        note: 'Too tired after work (10:15 PM)',
        previousDueAt: now - 7 * dayMs,
        newDueAt: now - 3 * dayMs
      },
      {
        id: 'ev-24',
        type: 'POSTPONED',
        timestamp: now - 1 * dayMs,
        note: 'Rescheduled for today',
        previousDueAt: now - 3 * dayMs,
        newDueAt: now + 6 * 60 * 60 * 1000
      }
    ]
  },
  {
    id: 'task-3',
    userId: 'user-demo',
    title: 'Call Arun',
    description: 'Catch up regarding upcoming weekend road trip.',
    createdAt: now - 1 * dayMs,
    updatedAt: now,
    dueAt: now + 26 * 60 * 60 * 1000, // Due tomorrow
    completedAt: null,
    reminderAt: null,
    priority: 'LOW',
    recurrence: 'NONE',
    completed: false,
    archived: false,
    postponedCount: 0,
    totalPostponementDuration: 0,
    lastPostponedAt: null,
    lastCompletedAt: null,
    attemptCount: 0,
    lastOpenedAt: null,
    history: [
      {
        id: 'ev-30',
        type: 'CREATED',
        timestamp: now - 1 * dayMs
      }
    ]
  },
  {
    id: 'task-4',
    userId: 'user-demo',
    title: 'Submit tax documentation',
    description: 'Upload investment declarations and Form 16 receipts to employer portal.',
    createdAt: now - 22 * dayMs,
    updatedAt: now,
    dueAt: now - 2 * dayMs, // Overdue!
    completedAt: null,
    reminderAt: null,
    priority: 'HIGH',
    recurrence: 'NONE',
    completed: false,
    archived: false,
    postponedCount: 5,
    totalPostponementDuration: 18 * dayMs,
    lastPostponedAt: now - 3 * dayMs,
    lastCompletedAt: null,
    attemptCount: 4,
    lastOpenedAt: now - 3 * dayMs,
    history: [
      { id: 'ev-40', type: 'CREATED', timestamp: now - 22 * dayMs },
      { id: 'ev-41', type: 'POSTPONED', timestamp: now - 18 * dayMs },
      { id: 'ev-42', type: 'POSTPONED', timestamp: now - 14 * dayMs },
      { id: 'ev-43', type: 'POSTPONED', timestamp: now - 10 * dayMs },
      { id: 'ev-44', type: 'POSTPONED', timestamp: now - 6 * dayMs },
      { id: 'ev-45', type: 'POSTPONED', timestamp: now - 3 * dayMs, note: 'Postponed again late evening' }
    ]
  }
];
