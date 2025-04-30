import React, { useState } from 'react';
import { Search, BookOpen, BookText, Tag, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { mockData } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

const KnowledgeBasePage: React.FC = () => {
  const { knowledgeBase } = mockData;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Get unique categories
  const categories = Array.from(new Set(knowledgeBase.map(item => item.category)));
  
  // Filter knowledge base items based on search and category
  const filteredItems = knowledgeBase.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === null || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Toggle item expansion
  const toggleItemExpansion = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <h1 className="mb-1 text-3xl font-bold">Knowledge Base</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Access academic resources and study materials
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-6 grid gap-4 md:grid-cols-5">
        <div className="relative md:col-span-3">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={18} className="text-slate-500 dark:text-slate-400" />
          </div>
          <input
            type="text"
            className="input w-full pl-10"
            placeholder="Search knowledge base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="md:col-span-2">
          <select
            className="input w-full"
            value={activeCategory || ''}
            onChange={(e) => setActiveCategory(e.target.value || null)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          className={`btn ${activeCategory === null ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveCategory(null)}
        >
          All
        </button>
        
        {categories.map(category => (
          <button
            key={category}
            className={`btn ${activeCategory === category ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Knowledge base items */}
      <div className="card flex-1 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <BookOpen size={32} />
            </div>
            <h3 className="mb-2 text-xl font-medium">No items found</h3>
            <p className="text-slate-500 dark:text-slate-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-slate-200 bg-white p-4 transition-all dark:border-slate-700 dark:bg-slate-800"
              >
                <div 
                  className="flex cursor-pointer items-start justify-between"
                  onClick={() => toggleItemExpansion(item.id)}
                >
                  <div className="flex items-start">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                      <BookText size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {item.category} • {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                    {expandedItems.includes(item.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
                
                <AnimatePresence>
                  {expandedItems.includes(item.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 overflow-hidden"
                    >
                      <p className="mb-4 text-slate-600 dark:text-slate-300">
                        {item.content}
                      </p>
                      
                      {item.tags.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {item.tags.map(tag => (
                            <span 
                              key={tag} 
                              className="flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                            >
                              <Tag size={12} className="mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {item.source && (
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          <span className="font-medium">Source:</span> {item.source}
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-end">
                        <button className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                          View full resource <ArrowRight size={16} className="ml-1" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBasePage;