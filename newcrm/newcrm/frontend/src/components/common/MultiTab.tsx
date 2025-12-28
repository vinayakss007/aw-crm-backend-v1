import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TabItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface MultiTabProps {
  initialTabs?: TabItem[];
}

const MultiTab: React.FC<MultiTabProps> = ({ initialTabs = [] }) => {
  const [tabs, setTabs] = useState<TabItem[]>(initialTabs);
  const [activeTabId, setActiveTabId] = useState<string | null>(initialTabs[0]?.id || null);

  const addTab = (tab: TabItem) => {
    // Check if tab already exists
    const existingTab = tabs.find(t => t.id === tab.id);
    if (!existingTab) {
      setTabs([...tabs, tab]);
      setActiveTabId(tab.id);
    } else {
      setActiveTabId(tab.id);
    }
  };

  const removeTab = (id: string) => {
    const newTabs = tabs.filter(tab => tab.id !== id);
    setTabs(newTabs);
    
    if (activeTabId === id) {
      const newActiveTab = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
      setActiveTabId(newActiveTab);
    }
  };

  const activateTab = (id: string) => {
    setActiveTabId(id);
  };

  return (
    <div className="w-full">
      {/* Tab headers */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center px-4 py-2 text-sm font-medium cursor-pointer ${
              activeTabId === tab.id
                ? 'text-blue-600 border-b-2 border-blue-500 bg-white dark:bg-gray-900'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => activateTab(tab.id)}
          >
            <span>{tab.title}</span>
            <button
              className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                removeTab(tab.id);
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      
      {/* Tab content */}
      <div className="py-4">
        {tabs.find(tab => tab.id === activeTabId)?.content}
      </div>
    </div>
  );
};

export default MultiTab;