import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { format, isSameDay, isPast, isToday, addDays, isWithinInterval } from 'date-fns';
import { Plus, Check, Clock, Calendar, Bell, BookOpen, Tag, Edit, Trash, AlertTriangle } from 'lucide-react';
import { Deadline } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const DeadlinesPage: React.FC = () => {
  const { deadlines, addDeadline, updateDeadline, deleteDeadline } = useApp();
  const [isAddingDeadline, setIsAddingDeadline] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past' | 'today'>('upcoming');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    subject: '',
    priority: 'medium',
    reminder: true,
    reminderTime: format(addDays(new Date(), -1), 'yyyy-MM-dd'),
  });
  
  // Filter deadlines based on active filter
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const filteredDeadlines = deadlines.filter(deadline => {
    const dueDate = new Date(deadline.dueDate);
    
    switch (activeFilter) {
      case 'upcoming':
        return !isPast(dueDate) || isToday(dueDate);
      case 'past':
        return isPast(dueDate) && !isToday(dueDate);
      case 'today':
        return isToday(dueDate);
      default:
        return true;
    }
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  // Group deadlines by date
  const groupedDeadlines: { [key: string]: Deadline[] } = {};
  
  filteredDeadlines.forEach(deadline => {
    const dueDateStr = format(new Date(deadline.dueDate), 'yyyy-MM-dd');
    
    if (!groupedDeadlines[dueDateStr]) {
      groupedDeadlines[dueDateStr] = [];
    }
    
    groupedDeadlines[dueDateStr].push(deadline);
  });
  
  // Open add deadline form
  const openAddDeadlineForm = () => {
    setIsAddingDeadline(true);
    setSelectedDeadline(null);
    setFormData({
      title: '',
      description: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      subject: '',
      priority: 'medium',
      reminder: true,
      reminderTime: format(addDays(new Date(), -1), 'yyyy-MM-dd'),
    });
  };
  
  // Open edit deadline form
  const openEditDeadlineForm = (deadline: Deadline) => {
    setIsAddingDeadline(true);
    setSelectedDeadline(deadline);
    setFormData({
      title: deadline.title,
      description: deadline.description || '',
      dueDate: format(new Date(deadline.dueDate), 'yyyy-MM-dd'),
      subject: deadline.subject || '',
      priority: deadline.priority,
      reminder: deadline.reminder || false,
      reminderTime: deadline.reminderTime ? format(new Date(deadline.reminderTime), 'yyyy-MM-dd') : format(addDays(new Date(), -1), 'yyyy-MM-dd'),
    });
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  // Submit form to add/edit deadline
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const deadlineData: Partial<Deadline> = {
      title: formData.title,
      description: formData.description,
      dueDate: new Date(formData.dueDate),
      subject: formData.subject,
      priority: formData.priority as 'low' | 'medium' | 'high',
      reminder: formData.reminder,
      reminderTime: formData.reminder ? new Date(formData.reminderTime) : undefined,
    };
    
    if (selectedDeadline) {
      // Update existing deadline
      updateDeadline(selectedDeadline.id, {
        ...deadlineData,
        updatedAt: new Date(),
      });
    } else {
      // Add new deadline
      addDeadline({
        ...deadlineData,
        id: Math.random().toString(36).substring(2, 11),
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Deadline);
    }
    
    setIsAddingDeadline(false);
  };
  
  // Handle deadline delete
  const handleDeleteDeadline = (id: string) => {
    if (confirm('Are you sure you want to delete this deadline?')) {
      deleteDeadline(id);
    }
  };
  
  // Toggle deadline completion
  const toggleDeadlineCompletion = (deadline: Deadline) => {
    updateDeadline(deadline.id, {
      completed: !deadline.completed,
      updatedAt: new Date(),
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-bold">Deadlines & Reminders</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Track your assignments and project due dates
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={openAddDeadlineForm}
        >
          <Plus size={18} className="mr-1" /> Add Deadline
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          className={`btn ${activeFilter === 'upcoming' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveFilter('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`btn ${activeFilter === 'today' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveFilter('today')}
        >
          Today
        </button>
        <button
          className={`btn ${activeFilter === 'past' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveFilter('past')}
        >
          Past
        </button>
        <button
          className={`btn ${activeFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
      </div>

      {/* Deadlines list */}
      <div className="card flex-1 overflow-y-auto p-0">
        {Object.keys(groupedDeadlines).length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Calendar size={32} />
            </div>
            <h3 className="mb-2 text-xl font-medium">No deadlines found</h3>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              {activeFilter === 'upcoming' 
                ? "You don't have any upcoming deadlines" 
                : activeFilter === 'today'
                ? "You don't have any deadlines due today"
                : activeFilter === 'past'
                ? "You don't have any past deadlines"
                : "You don't have any deadlines yet"}
            </p>
            <button
              className="btn btn-primary"
              onClick={openAddDeadlineForm}
            >
              <Plus size={18} className="mr-1" /> Add Deadline
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {Object.keys(groupedDeadlines)
              .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
              .map(dateStr => {
                const date = new Date(dateStr);
                const deadlineGroup = groupedDeadlines[dateStr];
                const isPastDate = isPast(date) && !isToday(date);
                const isToday = isSameDay(date, new Date());
                
                return (
                  <div key={dateStr} className="p-4">
                    <div className="mb-4 flex items-center">
                      <h3 className="font-medium">
                        {format(date, 'EEEE, MMMM d, yyyy')}
                      </h3>
                      <span 
                        className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                          isPastDate
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : isToday
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}
                      >
                        {isPastDate ? 'Past Due' : isToday ? 'Today' : 'Upcoming'}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <AnimatePresence>
                        {deadlineGroup.map(deadline => (
                          <motion.div
                            key={deadline.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`rounded-lg border p-4 ${
                              deadline.completed
                                ? 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'
                                : isPastDate
                                  ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10'
                                  : isToday
                                    ? 'border-indigo-200 bg-indigo-50 dark:border-indigo-900/50 dark:bg-indigo-900/10'
                                    : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-start">
                              <button
                                className={`mr-3 mt-1 flex h-5 w-5 items-center justify-center rounded-full border ${
                                  deadline.completed
                                    ? 'border-green-500 bg-green-500 text-white dark:border-green-400 dark:bg-green-400'
                                    : 'border-slate-300 dark:border-slate-600'
                                }`}
                                onClick={() => toggleDeadlineCompletion(deadline)}
                              >
                                {deadline.completed && <Check size={12} />}
                              </button>
                              
                              <div className="flex-1">
                                <h4 className={`font-medium ${deadline.completed ? 'line-through text-slate-500 dark:text-slate-400' : ''}`}>
                                  {deadline.title}
                                </h4>
                                
                                {deadline.description && (
                                  <p className={`mt-1 text-sm text-slate-600 dark:text-slate-300 ${deadline.completed ? 'line-through text-slate-500 dark:text-slate-400' : ''}`}>
                                    {deadline.description}
                                  </p>
                                )}
                                
                                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                                  <span className={`flex items-center gap-1 text-xs ${
                                    deadline.priority === 'high' 
                                      ? 'text-red-600 dark:text-red-400' 
                                      : deadline.priority === 'medium'
                                        ? 'text-yellow-600 dark:text-yellow-400'
                                        : 'text-green-600 dark:text-green-400'
                                  }`}>
                                    <Tag size={12} />
                                    {deadline.priority.charAt(0).toUpperCase() + deadline.priority.slice(1)} Priority
                                  </span>
                                  
                                  {deadline.subject && (
                                    <span className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
                                      <BookOpen size={12} />
                                      {deadline.subject}
                                    </span>
                                  )}
                                  
                                  {deadline.reminder && (
                                    <span className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
                                      <Bell size={12} />
                                      Reminder: {format(new Date(deadline.reminderTime || deadline.dueDate), 'MMM d')}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex space-x-2 pl-4">
                                <button
                                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                                  onClick={() => openEditDeadlineForm(deadline)}
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  className="rounded p-1 text-slate-400 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                                  onClick={() => handleDeleteDeadline(deadline.id)}
                                >
                                  <Trash size={16} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Add/Edit Deadline Modal */}
      {isAddingDeadline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800"
          >
            <h2 className="mb-4 text-xl font-bold">
              {selectedDeadline ? 'Edit Deadline' : 'Add New Deadline'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="input w-full"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium" htmlFor="description">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="input w-full"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium" htmlFor="dueDate">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  className="input w-full"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium" htmlFor="subject">
                    Subject (Optional)
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="input w-full"
                    value={formData.subject}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium" htmlFor="priority">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    className="input w-full"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="reminder"
                    name="reminder"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={formData.reminder}
                    onChange={handleInputChange}
                  />
                  <label className="ml-2 block text-sm font-medium" htmlFor="reminder">
                    Set Reminder
                  </label>
                </div>
              </div>
              
              {formData.reminder && (
                <div className="mb-6">
                  <label className="mb-1 block text-sm font-medium" htmlFor="reminderTime">
                    Reminder Date
                  </label>
                  <input
                    type="date"
                    id="reminderTime"
                    name="reminderTime"
                    className="input w-full"
                    value={formData.reminderTime}
                    onChange={handleInputChange}
                    required={formData.reminder}
                  />
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsAddingDeadline(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {selectedDeadline ? 'Update' : 'Add'} Deadline
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DeadlinesPage;