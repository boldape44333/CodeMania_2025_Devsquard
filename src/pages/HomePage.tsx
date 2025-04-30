import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MessageSquare, Sparkles, BarChart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { schedules, deadlines, tasks } = useApp();
  
  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Filter today's schedules
  const todaySchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.startTime);
    scheduleDate.setHours(0, 0, 0, 0);
    return scheduleDate.getTime() === today.getTime();
  });
  
  // Filter upcoming deadlines (next 7 days)
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const upcomingDeadlines = deadlines
    .filter(deadline => {
      const dueDate = new Date(deadline.dueDate);
      return dueDate >= today && dueDate <= nextWeek && !deadline.completed;
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  // Calculate task completion stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Card components for homepage
  const Card = ({ title, icon, content, footer, onClick }: { 
    title: string; 
    icon: React.ReactNode; 
    content: React.ReactNode;
    footer?: React.ReactNode;
    onClick?: () => void;
  }) => (
    <div 
      className="card transition-transform hover:scale-[1.01] hover:shadow-md"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
        <span className="text-indigo-600 dark:text-indigo-400">{icon}</span>
      </div>
      <div className="mb-4">{content}</div>
      {footer && <div className="mt-auto text-sm text-slate-500 dark:text-slate-400">{footer}</div>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Welcome Back!</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Here's your academic overview for today, {format(today, 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Schedule */}
        <Card
          title="Today's Schedule"
          icon={<Calendar size={20} />}
          content={
            <div className="space-y-3">
              {todaySchedules.length > 0 ? (
                todaySchedules.slice(0, 3).map((schedule) => (
                  <div key={schedule.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                    <p className="font-medium">{schedule.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {format(new Date(schedule.startTime), 'h:mm a')} - {format(new Date(schedule.endTime), 'h:mm a')}
                    </p>
                    {schedule.location && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        📍 {schedule.location}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-500 dark:text-slate-400">No scheduled events for today</p>
              )}
            </div>
          }
          footer={todaySchedules.length > 3 ? `+${todaySchedules.length - 3} more events` : undefined}
          onClick={() => navigate('/schedule')}
        />

        {/* Upcoming Deadlines */}
        <Card
          title="Upcoming Deadlines"
          icon={<Clock size={20} />}
          content={
            <div className="space-y-3">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.slice(0, 3).map((deadline) => (
                  <div 
                    key={deadline.id} 
                    className={`rounded-lg border p-3 ${
                      new Date(deadline.dueDate).getTime() < tomorrow.getTime()
                        ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <p className="font-medium">{deadline.title}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Due: {format(new Date(deadline.dueDate), 'MMM d')}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${
                        deadline.priority === 'high' 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                          : deadline.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {deadline.priority}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 dark:text-slate-400">No upcoming deadlines</p>
              )}
            </div>
          }
          footer={upcomingDeadlines.length > 3 ? `+${upcomingDeadlines.length - 3} more deadlines` : undefined}
          onClick={() => navigate('/deadlines')}
        />

        {/* AI Assistant */}
        <Card
          title="AI Assistant"
          icon={<Sparkles size={20} />}
          content={
            <div className="space-y-3">
              <p className="text-slate-600 dark:text-slate-300">Need help with your studies?</p>
              <button 
                className="btn btn-primary w-full"
                onClick={() => navigate('/assistant')}
              >
                <MessageSquare size={16} className="mr-2" />
                Chat with Assistant
              </button>
              <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                <p>Ask about:</p>
                <ul className="mt-1 list-inside list-disc">
                  <li>Study techniques</li>
                  <li>Assignment help</li>
                  <li>Schedule planning</li>
                </ul>
              </div>
            </div>
          }
          onClick={() => navigate('/assistant')}
        />
      </section>

      {/* Progress Section */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold">Your Progress</h2>
        <div className="card">
          <div className="flex items-center">
            <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
              <BarChart size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium">Task Completion</h3>
              <p className="text-slate-500 dark:text-slate-400">
                You've completed {completedTasks} of {totalTasks} tasks
              </p>
            </div>
            <div className="ml-auto text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {completionRate}%
            </div>
          </div>
          
          <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div 
              className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500" 
              style={{ width: `${completionRate}%` }}
            />
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/schedule')}
            >
              <Calendar size={16} className="mr-2" />
              View Schedule
            </button>
            <button 
              className="btn btn-ghost"
              onClick={() => navigate('/deadlines')}
            >
              <Clock size={16} className="mr-2" />
              Manage Deadlines
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;