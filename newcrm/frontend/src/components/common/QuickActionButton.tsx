import React, { useState } from 'react';
import { Plus, Phone, Mail, Calendar, User, Briefcase, X } from 'lucide-react';

interface QuickActionButtonProps {
  position?: 'bottom-right' | 'top-right' | 'floating';
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ position = 'bottom-right' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: User, label: 'Add Lead', action: () => console.log('Add Lead') },
    { icon: Briefcase, label: 'Create Deal', action: () => console.log('Create Deal') },
    { icon: Phone, label: 'Schedule Call', action: () => console.log('Schedule Call') },
    { icon: Mail, label: 'Send Email', action: () => console.log('Send Email') },
    { icon: Calendar, label: 'Schedule Meeting', action: () => console.log('Schedule Meeting') },
  ];

  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6 z-50',
    'top-right': 'fixed top-24 right-6 z-50',
    'floating': 'absolute top-1/2 right-6 transform -translate-y-1/2 z-50',
  };

  return (
    <div className={positionClasses[position]}>
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 space-y-2">
          {actions.map((action, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-3 flex items-center space-x-3 w-40 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <action.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{action.label}</span>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  action.action();
                  setIsOpen(false);
                }}
              >
                <Plus className="h-4 w-4 transform rotate-45" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        className={`bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center ${
          isOpen ? 'bg-blue-800' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Quick actions"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default QuickActionButton;