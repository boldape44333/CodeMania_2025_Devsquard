import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MessageSquare, 
  BookOpen, 
  Settings, 
  Home, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  BellDot 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode, deadlines } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Filter deadlines due today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const urgentDeadlines = deadlines.filter(deadline => {
    const dueDate = new Date(deadline.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate >= today && dueDate < tomorrow && !deadline.completed;
  });

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/schedule', label: 'Schedule', icon: <Calendar size={20} /> },
    { path: '/deadlines', label: 'Deadlines', icon: <Clock size={20} /> },
    { path: '/assistant', label: 'Assistant', icon: <MessageSquare size={20} /> },
    { path: '/knowledge', label: 'Knowledge Base', icon: <BookOpen size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 lg:px-6">
        <div className="flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="mr-4 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center space-x-2 font-medium">
            <span className="text-2xl text-indigo-600 dark:text-indigo-400">
              <MessageSquare size={28} />
            </span>
            <span className="text-xl font-bold">StudyBuddy AI</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            className="relative rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Notifications"
            onClick={() => navigate('/deadlines')}
          >
            <BellDot size={20} />
            {urgentDeadlines.length > 0 && (
              <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {urgentDeadlines.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside className="hidden border-r border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80 lg:block lg:w-64">
          <nav className="flex h-full flex-col p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`flex w-full items-center rounded-lg px-4 py-2.5 text-sm font-medium ${
                      location.pathname === item.path
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                    
                    {item.label === 'Deadlines' && urgentDeadlines.length > 0 && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {urgentDeadlines.length}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-y-0 left-0 z-20 mt-16 w-64 border-r border-slate-200 bg-white pt-2 dark:border-slate-800 dark:bg-slate-900 lg:hidden"
            >
              <nav className="flex h-full flex-col p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <button
                        onClick={() => {
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex w-full items-center rounded-lg px-4 py-2.5 text-sm font-medium ${
                          location.pathname === item.path
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.label}
                        
                        {item.label === 'Deadlines' && urgentDeadlines.length > 0 && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {urgentDeadlines.length}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backdrop for mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-10 bg-black lg:hidden"
            onClick={toggleMobileMenu}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;