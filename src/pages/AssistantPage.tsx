import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Sparkles, User, Bot, Paperclip, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const AssistantPage: React.FC = () => {
  const { chatHistory, sendMessage } = useApp();
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);
  
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const toggleRecording = () => {
    // In a real app, this would use the Web Speech API
    setIsRecording(!isRecording);
    if (isRecording) {
      // Simulate voice recognition result
      setTimeout(() => {
        setInputMessage(prev => prev + "Can you help me organize my study schedule?");
        setIsRecording(false);
      }, 2000);
    }
  };
  
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Assistant</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Ask questions, get study help, or manage your schedule
          </p>
        </div>
        <button
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          onClick={toggleInfo}
        >
          <Info size={20} />
        </button>
      </div>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 overflow-hidden rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-900/20"
          >
            <h3 className="mb-2 font-medium text-indigo-700 dark:text-indigo-400">
              <Sparkles size={18} className="mr-2 inline-block" />
              AI Assistant Capabilities
            </h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-300">
              <li>Answer academic questions from the knowledge base</li>
              <li>Help manage your study schedule and create study plans</li>
              <li>Set reminders for upcoming deadlines</li>
              <li>Provide study techniques and resources</li>
              <li>Assist with assignment planning and organization</li>
            </ul>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Note: This is a demo version with simulated AI responses.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat container */}
      <div className="card flex-1 overflow-hidden">
        <div className="flex h-full flex-col">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-1 py-4">
            <div className="space-y-4">
              {chatHistory.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="mb-6 rounded-full bg-indigo-100 p-4 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="mb-2 text-xl font-medium">AI Assistant</h3>
                  <p className="mx-auto max-w-md text-slate-500 dark:text-slate-400">
                    I'm here to help with your academic needs. Ask me questions about your courses, 
                    help managing your schedule, or assistance with study techniques.
                  </p>
                  <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      className="btn btn-ghost text-left"
                      onClick={() => setInputMessage("Can you help me create a study plan for my exams?")}
                    >
                      Create a study plan for my exams
                    </button>
                    <button
                      className="btn btn-ghost text-left"
                      onClick={() => setInputMessage("What deadlines do I have coming up this week?")}
                    >
                      What deadlines do I have this week?
                    </button>
                    <button
                      className="btn btn-ghost text-left"
                      onClick={() => setInputMessage("I need help with integration techniques in calculus")}
                    >
                      Help with integration techniques
                    </button>
                    <button
                      className="btn btn-ghost text-left"
                      onClick={() => setInputMessage("Can you suggest some effective study methods?")}
                    >
                      Suggest effective study methods
                    </button>
                  </div>
                </div>
              ) : (
                chatHistory.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.sender === 'user'
                          ? 'rounded-tr-none bg-indigo-600 text-white'
                          : 'rounded-tl-none bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white dark:bg-slate-700">
                          {message.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </span>
                        <span className="text-xs font-medium">
                          {message.sender === 'user' ? 'You' : 'AI Assistant'}
                        </span>
                        <span className="ml-auto text-xs opacity-70">
                          {format(new Date(message.timestamp), 'h:mm a')}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className="border-t border-slate-200 p-4 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <button 
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                aria-label="Attach file"
              >
                <Paperclip size={20} />
              </button>
              <div className="relative flex-1">
                <textarea
                  className="input h-12 w-full resize-none py-3 pl-4 pr-12"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows={1}
                  style={{ minHeight: '48px' }}
                ></textarea>
                <button
                  className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-500 transition-colors hover:bg-indigo-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 ${isRecording ? 'animate-pulse bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400' : ''}`}
                  aria-label="Voice input"
                  onClick={toggleRecording}
                >
                  <Mic size={18} />
                </button>
              </div>
              <button
                className="btn btn-primary"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;