import React from 'react';
import { Calendar, Clock, User, Mail, Phone, FileText } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-5 w-5" />;
      case 'email': return <Mail className="h-5 w-5" />;
      case 'meeting': return <Calendar className="h-5 w-5" />;
      case 'note': return <FileText className="h-5 w-5" />;
      case 'task': return <Clock className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'email': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'meeting': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'note': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'task': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="flow-root">
      <ul className="relative">
        {activities.map((activity, index) => (
          <li key={activity.id} className="pb-10">
            {index !== activities.length - 1 && (
              <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
            )}
            <div className="relative flex space-x-3">
              <div>
                <span className={`flex h-10 w-10 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </span>
              </div>
              <div className="flex min-w-0 flex-1 justify-between">
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.title}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.description}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <User className="h-4 w-4 mr-1" />
                    <span>{activity.user}</span>
                    <Clock className="h-4 w-4 ml-3 mr-1" />
                    <span>{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityTimeline;