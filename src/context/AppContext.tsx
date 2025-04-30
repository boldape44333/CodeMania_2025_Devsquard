import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Task, Schedule, Deadline, ChatMessage } from '../types';
import { mockData } from '../data/mockData';

type AppContextType = {
  tasks: Task[];
  schedules: Schedule[];
  deadlines: Deadline[];
  chatHistory: ChatMessage[];
  darkMode: boolean;
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (id: string, schedule: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  addDeadline: (deadline: Deadline) => void;
  updateDeadline: (id: string, deadline: Partial<Deadline>) => void;
  deleteDeadline: (id: string) => void;
  sendMessage: (message: string) => void;
  toggleDarkMode: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(mockData.tasks);
  const [schedules, setSchedules] = useState<Schedule[]>(mockData.schedules);
  const [deadlines, setDeadlines] = useState<Deadline[]>(mockData.deadlines);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(mockData.chatHistory);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Check for user's preferred color scheme
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  // Task functions
  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, ...updatedTask } : task));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Schedule functions
  const addSchedule = (schedule: Schedule) => {
    setSchedules([...schedules, schedule]);
  };

  const updateSchedule = (id: string, updatedSchedule: Partial<Schedule>) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id ? { ...schedule, ...updatedSchedule } : schedule
    ));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  // Deadline functions
  const addDeadline = (deadline: Deadline) => {
    setDeadlines([...deadlines, deadline]);
  };

  const updateDeadline = (id: string, updatedDeadline: Partial<Deadline>) => {
    setDeadlines(deadlines.map(deadline => 
      deadline.id === id ? { ...deadline, ...updatedDeadline } : deadline
    ));
  };

  const deleteDeadline = (id: string) => {
    setDeadlines(deadlines.filter(deadline => deadline.id !== id));
  };

  // Chat functions
  const sendMessage = (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setChatHistory([...chatHistory, userMessage]);
    
    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(message),
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // Mock AI response generator
  const generateAIResponse = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      return "Hello! I'm your student assistant. How can I help you today?";
    } else if (lowerMsg.includes('deadline')) {
      return `You have ${deadlines.length} deadlines coming up. The nearest one is "${deadlines[0]?.title}" due on ${format(new Date(deadlines[0]?.dueDate || new Date()), 'PPP')}.`;
    } else if (lowerMsg.includes('schedule')) {
      return "I can help you manage your study schedule. Would you like to see today's schedule or create a new study block?";
    } else if (lowerMsg.includes('help')) {
      return "I can help with managing your schedules, tracking deadlines, answering academic questions, and more. Just ask me what you need!";
    } else {
      return "I'm here to assist with your academic needs. Could you please provide more details about what you're looking for?";
    }
  };

  const value = {
    tasks,
    schedules,
    deadlines,
    chatHistory,
    darkMode,
    addTask,
    updateTask,
    deleteTask,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    addDeadline,
    updateDeadline,
    deleteDeadline,
    sendMessage,
    toggleDarkMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};