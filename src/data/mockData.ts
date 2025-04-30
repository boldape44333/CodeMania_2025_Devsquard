import { Task, Schedule, Deadline, ChatMessage, KnowledgeItem } from '../types';
import { addDays, addHours, subDays, setHours, setMinutes } from 'date-fns';

// Helper to create dates
const today = new Date();
const tomorrow = addDays(today, 1);
const nextWeek = addDays(today, 7);
const yesterday = subDays(today, 1);

// Generate random ID
const generateId = () => Math.random().toString(36).substring(2, 11);

// Mock tasks
const tasks: Task[] = [
  {
    id: generateId(),
    title: 'Read Chapter 5 of Calculus Textbook',
    description: 'Focus on integration techniques and applications',
    completed: false,
    dueDate: tomorrow,
    priority: 'high',
    subject: 'Mathematics',
    createdAt: yesterday,
    updatedAt: yesterday,
  },
  {
    id: generateId(),
    title: 'Complete Physics Lab Report',
    description: 'Include all calculations, observations, and conclusions',
    completed: false,
    dueDate: addDays(today, 3),
    priority: 'medium',
    subject: 'Physics',
    createdAt: subDays(today, 2),
    updatedAt: yesterday,
  },
  {
    id: generateId(),
    title: 'Prepare for Literature Discussion',
    description: 'Read chapters 10-12 and prepare discussion points',
    completed: true,
    dueDate: yesterday,
    priority: 'medium',
    subject: 'Literature',
    createdAt: subDays(today, 5),
    updatedAt: yesterday,
  },
  {
    id: generateId(),
    title: 'Start Research for Term Paper',
    description: 'Find at least 5 academic sources and create an outline',
    completed: false,
    dueDate: addDays(today, 10),
    priority: 'low',
    subject: 'History',
    createdAt: subDays(today, 1),
    updatedAt: subDays(today, 1),
  },
];

// Mock schedules
const schedules: Schedule[] = [
  {
    id: generateId(),
    title: 'Calculus Study Session',
    description: 'Review integration by parts',
    startTime: setHours(setMinutes(today, 0), 14),
    endTime: setHours(setMinutes(today, 0), 16),
    subject: 'Mathematics',
    location: 'Library',
    recurring: true,
    recurringPattern: 'weekly',
    color: '#4F46E5',
    createdAt: subDays(today, 7),
    updatedAt: subDays(today, 7),
  },
  {
    id: generateId(),
    title: 'Physics Lab',
    description: 'Experiment on projectile motion',
    startTime: setHours(setMinutes(tomorrow, 0), 10),
    endTime: setHours(setMinutes(tomorrow, 0), 12),
    subject: 'Physics',
    location: 'Science Building, Room 302',
    recurring: true,
    recurringPattern: 'weekly',
    color: '#0D9488',
    createdAt: subDays(today, 14),
    updatedAt: subDays(today, 14),
  },
  {
    id: generateId(),
    title: 'Group Project Meeting',
    description: 'Discuss progress and assign next tasks',
    startTime: setHours(setMinutes(addDays(today, 2), 0), 15),
    endTime: setHours(setMinutes(addDays(today, 2), 0), 16),
    subject: 'Computer Science',
    location: 'Online - Zoom',
    recurring: false,
    color: '#7E22CE',
    createdAt: subDays(today, 2),
    updatedAt: subDays(today, 2),
  },
];

// Mock deadlines
const deadlines: Deadline[] = [
  {
    id: generateId(),
    title: 'Math Assignment 3',
    description: 'Problems 1-15 from Chapter 5',
    dueDate: addDays(today, 2),
    subject: 'Mathematics',
    priority: 'high',
    completed: false,
    reminder: true,
    reminderTime: addDays(today, 1),
    createdAt: subDays(today, 5),
    updatedAt: subDays(today, 5),
  },
  {
    id: generateId(),
    title: 'Term Paper Outline',
    description: 'Submit detailed outline with thesis and main points',
    dueDate: addDays(today, 7),
    subject: 'History',
    priority: 'medium',
    completed: false,
    reminder: true,
    reminderTime: addDays(today, 6),
    createdAt: subDays(today, 10),
    updatedAt: subDays(today, 8),
  },
  {
    id: generateId(),
    title: 'Lab Report Submission',
    description: 'Final report with all experimental data and analysis',
    dueDate: addDays(today, 4),
    subject: 'Physics',
    priority: 'high',
    completed: false,
    reminder: true,
    reminderTime: addDays(today, 3),
    createdAt: subDays(today, 7),
    updatedAt: subDays(today, 7),
  },
  {
    id: generateId(),
    title: 'Programming Assignment',
    description: 'Implement a binary search tree with required operations',
    dueDate: nextWeek,
    subject: 'Computer Science',
    priority: 'medium',
    completed: false,
    reminder: true,
    reminderTime: addDays(today, 6),
    createdAt: subDays(today, 14),
    updatedAt: subDays(today, 14),
  },
];

// Mock chat history
const chatHistory: ChatMessage[] = [
  {
    id: generateId(),
    content: 'Hello! I need help with my upcoming assignments.',
    sender: 'user',
    timestamp: subDays(today, 2),
  },
  {
    id: generateId(),
    content: "Hi there! I'd be happy to help. You have several assignments coming up. Your Math Assignment 3 is due in 2 days. Would you like me to help you create a study plan for it?",
    sender: 'assistant',
    timestamp: subDays(today, 2),
  },
  {
    id: generateId(),
    content: 'Yes, please. I need to focus on integration techniques.',
    sender: 'user',
    timestamp: subDays(today, 2),
  },
  {
    id: generateId(),
    content: "I recommend starting with a 2-hour study session today focusing on the integration techniques in Chapter 5. I've added a study block to your schedule from 2-4 PM. Would you like to see some practice problems for these concepts?",
    sender: 'assistant',
    timestamp: subDays(today, 2),
  },
  {
    id: generateId(),
    content: 'What about my Physics lab report?',
    sender: 'user',
    timestamp: subDays(today, 1),
  },
  {
    id: generateId(),
    content: "Your Physics lab report is due in 4 days. After your Math assignment, you should allocate time for it. Would you like me to suggest a structure for your lab report or help you organize your time to work on both assignments?",
    sender: 'assistant',
    timestamp: subDays(today, 1),
  },
];

// Mock knowledge base items
const knowledgeBase: KnowledgeItem[] = [
  {
    id: generateId(),
    title: 'Integration Techniques Overview',
    content: 'This guide covers basic integration techniques including substitution, integration by parts, partial fractions, and trigonometric substitutions.',
    category: 'Mathematics',
    tags: ['calculus', 'integration', 'study guide'],
    source: 'University Mathematics Department',
    createdAt: subDays(today, 30),
    updatedAt: subDays(today, 30),
  },
  {
    id: generateId(),
    title: 'Lab Report Structure',
    content: 'A comprehensive guide to writing scientific lab reports including sections on abstract, introduction, methodology, results, discussion, and conclusion.',
    category: 'Sciences',
    tags: ['lab report', 'scientific writing', 'research'],
    source: 'University Science Department',
    createdAt: subDays(today, 45),
    updatedAt: subDays(today, 45),
  },
  {
    id: generateId(),
    title: 'Effective Study Techniques',
    content: 'Research-based study methods including spaced repetition, active recall, the Pomodoro technique, and concept mapping.',
    category: 'Study Skills',
    tags: ['studying', 'productivity', 'learning'],
    source: 'University Learning Center',
    createdAt: subDays(today, 60),
    updatedAt: subDays(today, 60),
  },
];

// Export all mock data
export const mockData = {
  tasks,
  schedules,
  deadlines,
  chatHistory,
  knowledgeBase,
};