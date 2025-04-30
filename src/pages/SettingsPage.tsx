import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Save, Moon, Bell, Sun, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPage: React.FC = () => {
  const { darkMode, toggleDarkMode } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState(24); // hours before deadline
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  
  // Handle notifications toggle
  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };
  
  // Handle save settings
  const handleSaveSettings = () => {
    // In a real app, this would save to backend/localStorage
    setSavedMessage('Settings saved successfully');
    
    // Clear the message after 3 seconds
    setTimeout(() => {
      setSavedMessage(null);
    }, 3000);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <h1 className="mb-1 text-3xl font-bold">Settings</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Customize your student assistant experience
        </p>
      </div>

      {/* Settings card */}
      <div className="card flex-1">
        {savedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-900/20 dark:text-green-400"
          >
            {savedMessage}
          </motion.div>
        )}

        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {/* Appearance */}
          <div className="pb-6">
            <h2 className="mb-4 text-xl font-medium">Appearance</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Dark Mode</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Toggle between light and dark theme
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300 dark:bg-slate-600"
              >
                <span className="sr-only">Toggle dark mode</span>
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                    darkMode ? 'translate-x-6 dark:bg-slate-900' : 'translate-x-1'
                  }`}
                />
                <span className="absolute left-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {darkMode ? <Moon size={12} /> : <Sun size={12} />}
                </span>
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="py-6">
            <h2 className="mb-4 text-xl font-medium">Notifications</h2>
            
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">Enable Notifications</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Receive notifications for deadlines and reminders
                </p>
              </div>
              <button
                onClick={handleNotificationsToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  notificationsEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span className="sr-only">Toggle notifications</span>
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
                <span className="absolute left-1.5 text-xs text-indigo-100">
                  {notificationsEnabled && <Bell size={12} />}
                </span>
              </button>
            </div>
            
            {notificationsEnabled && (
              <div className="ml-6 border-l-2 border-indigo-200 pl-4 dark:border-indigo-900">
                <div className="mb-4">
                  <h3 className="mb-2 font-medium">Default Reminder Time</h3>
                  <select
                    className="input w-full"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(Number(e.target.value))}
                  >
                    <option value="1">1 hour before</option>
                    <option value="3">3 hours before</option>
                    <option value="12">12 hours before</option>
                    <option value="24">1 day before</option>
                    <option value="48">2 days before</option>
                    <option value="72">3 days before</option>
                  </select>
                </div>
                
                <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                  <div className="flex items-start">
                    <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                    <p>Notification permissions must be enabled in your browser for this feature to work.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account */}
          <div className="py-6">
            <h2 className="mb-4 text-xl font-medium">Account</h2>
            
            <div className="mb-4">
              <label className="mb-1 block font-medium" htmlFor="name">
                Display Name
              </label>
              <input
                type="text"
                id="name"
                className="input w-full"
                placeholder="Your Name"
                defaultValue="Student"
              />
            </div>
            
            <div className="mb-4">
              <label className="mb-1 block font-medium" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input w-full"
                placeholder="your.email@example.com"
                defaultValue="student@example.com"
              />
            </div>
          </div>

          {/* Academic Preferences */}
          <div className="py-6">
            <h2 className="mb-4 text-xl font-medium">Academic Preferences</h2>
            
            <div className="mb-4">
              <label className="mb-1 block font-medium" htmlFor="subjects">
                Preferred Subjects
              </label>
              <select
                id="subjects"
                className="input w-full"
                multiple
                size={4}
                defaultValue={['Mathematics', 'Computer Science']}
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Literature">Literature</option>
                <option value="History">History</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Foreign Languages">Foreign Languages</option>
              </select>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Hold Ctrl/Cmd to select multiple subjects
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="btn btn-primary"
            onClick={handleSaveSettings}
          >
            <Save size={18} className="mr-2" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;