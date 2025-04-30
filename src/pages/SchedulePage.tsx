import React, { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Trash, Edit, Calendar as CalendarIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Schedule } from '../types';
import { motion } from 'framer-motion';

const SchedulePage: React.FC = () => {
  const { schedules, addSchedule, updateSchedule, deleteSchedule } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    startTime: format(new Date().setMinutes(0), "yyyy-MM-dd'T'HH:mm"),
    endTime: format(addDays(new Date().setMinutes(0), 0).setHours(new Date().getHours() + 1), "yyyy-MM-dd'T'HH:mm"),
    description: '',
    location: '',
    subject: '',
    color: '#4F46E5',
  });
  
  // Start of the current week
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Generate array of dates for the week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  // Get schedules for the current week
  const weekSchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.startTime);
    return weekDays.some(day => isSameDay(day, scheduleDate));
  });
  
  // Navigate to previous/next week
  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };
  
  // Open add schedule form
  const openAddScheduleForm = () => {
    setIsAddingSchedule(true);
    setSelectedSchedule(null);
    setFormData({
      title: '',
      startTime: format(new Date().setMinutes(0), "yyyy-MM-dd'T'HH:mm"),
      endTime: format(addDays(new Date().setMinutes(0), 0).setHours(new Date().getHours() + 1), "yyyy-MM-dd'T'HH:mm"),
      description: '',
      location: '',
      subject: '',
      color: '#4F46E5',
    });
  };
  
  // Open edit schedule form
  const openEditScheduleForm = (schedule: Schedule) => {
    setIsAddingSchedule(true);
    setSelectedSchedule(schedule);
    setFormData({
      title: schedule.title,
      startTime: format(new Date(schedule.startTime), "yyyy-MM-dd'T'HH:mm"),
      endTime: format(new Date(schedule.endTime), "yyyy-MM-dd'T'HH:mm"),
      description: schedule.description || '',
      location: schedule.location || '',
      subject: schedule.subject || '',
      color: schedule.color || '#4F46E5',
    });
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Submit form to add/edit schedule
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const scheduleData: Partial<Schedule> = {
      title: formData.title,
      description: formData.description,
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
      subject: formData.subject,
      location: formData.location,
      color: formData.color,
    };
    
    if (selectedSchedule) {
      // Update existing schedule
      updateSchedule(selectedSchedule.id, scheduleData);
    } else {
      // Add new schedule
      addSchedule({
        ...scheduleData,
        id: Math.random().toString(36).substring(2, 11),
        recurring: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Schedule);
    }
    
    setIsAddingSchedule(false);
  };
  
  // Handle schedule delete
  const handleDeleteSchedule = (id: string) => {
    if (confirm('Are you sure you want to delete this schedule item?')) {
      deleteSchedule(id);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-bold">Study Schedule</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Manage your study times and academic events
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={openAddScheduleForm}
        >
          <Plus size={18} className="mr-1" /> Add Schedule
        </button>
      </div>

      {/* Week navigation */}
      <div className="mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
        <button 
          className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
          onClick={() => navigateWeek('prev')}
        >
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="text-lg font-medium">
          Week of {format(startDate, 'MMMM d, yyyy')}
        </h2>
        
        <button 
          className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
          onClick={() => navigateWeek('next')}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Week days */}
      <div className="mb-4 grid grid-cols-7 gap-2 text-center font-medium">
        {weekDays.map((day, index) => (
          <div key={index} className="px-1 py-2">
            <div className="mb-1 text-xs uppercase text-slate-500 dark:text-slate-400">
              {format(day, 'EEE')}
            </div>
            <div 
              className={`rounded-full py-1 ${
                isSameDay(day, new Date()) 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400'
                  : ''
              }`}
            >
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Schedule grid */}
      <div className="card flex-1 overflow-y-auto">
        {weekSchedules.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <CalendarIcon size={32} />
            </div>
            <h3 className="mb-2 text-xl font-medium">No schedules for this week</h3>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              Create a new schedule to organize your study time
            </p>
            <button
              className="btn btn-primary"
              onClick={openAddScheduleForm}
            >
              <Plus size={18} className="mr-1" /> Add Schedule
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {weekDays.map((day, dayIndex) => {
              const daySchedules = weekSchedules.filter(schedule => 
                isSameDay(new Date(schedule.startTime), day)
              );
              
              return daySchedules.length > 0 ? (
                <div key={dayIndex} className="py-4">
                  <h3 className="mb-4 font-medium">
                    {format(day, 'EEEE, MMMM d')}
                    {isSameDay(day, new Date()) && (
                      <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">
                        Today
                      </span>
                    )}
                  </h3>
                  
                  <div className="space-y-3">
                    {daySchedules
                      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                      .map(schedule => (
                        <motion.div
                          key={schedule.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex rounded-lg border border-l-4 bg-white p-4 shadow-sm dark:bg-slate-800"
                          style={{ borderLeftColor: schedule.color || '#4F46E5' }}
                        >
                          <div className="flex-1">
                            <h4 className="font-medium">{schedule.title}</h4>
                            <div className="mt-1 flex items-center text-sm text-slate-500 dark:text-slate-400">
                              <Clock size={14} className="mr-1" />
                              {format(new Date(schedule.startTime), 'h:mm a')} - {format(new Date(schedule.endTime), 'h:mm a')}
                            </div>
                            
                            {schedule.location && (
                              <div className="mt-1 flex items-center text-sm text-slate-500 dark:text-slate-400">
                                <MapPin size={14} className="mr-1" />
                                {schedule.location}
                              </div>
                            )}
                            
                            {schedule.description && (
                              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                {schedule.description}
                              </p>
                            )}
                            
                            {schedule.subject && (
                              <div className="mt-2">
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                  {schedule.subject}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-start space-x-2 pl-4">
                            <button
                              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                              onClick={() => openEditScheduleForm(schedule)}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="rounded p-1 text-slate-400 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                              onClick={() => handleDeleteSchedule(schedule.id)}
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Schedule Modal */}
      {isAddingSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800"
          >
            <h2 className="mb-4 text-xl font-bold">
              {selectedSchedule ? 'Edit Schedule' : 'Add New Schedule'}
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
              
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium" htmlFor="startTime">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    id="startTime"
                    name="startTime"
                    className="input w-full"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium" htmlFor="endTime">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    id="endTime"
                    name="endTime"
                    className="input w-full"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
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
                  <label className="mb-1 block text-sm font-medium" htmlFor="location">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="input w-full"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="mb-1 block text-sm font-medium" htmlFor="color">
                  Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="color"
                    name="color"
                    className="h-10 w-10 cursor-pointer rounded border-0"
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Choose a color for your schedule
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsAddingSchedule(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {selectedSchedule ? 'Update' : 'Add'} Schedule
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;