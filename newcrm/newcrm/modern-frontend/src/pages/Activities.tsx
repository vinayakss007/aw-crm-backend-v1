import React from 'react';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Activities: React.FC = () => {
  // Mock data for activities
  const activities = [
    {
      id: '1',
      type: 'call',
      subject: 'Follow up with client',
      description: 'Discussed project requirements',
      date: '2023-10-15T10:30:00Z',
      duration: 30,
      owner: { firstName: 'John', lastName: 'Doe' },
      relatedTo: 'lead',
      relatedEntity: { name: 'Acme Corp' },
      status: 'completed',
    },
    {
      id: '2',
      type: 'email',
      subject: 'Project proposal',
      description: 'Sent project proposal to client',
      date: '2023-10-16T14:15:00Z',
      duration: 5,
      owner: { firstName: 'Jane', lastName: 'Smith' },
      relatedTo: 'opportunity',
      relatedEntity: { name: 'Enterprise Deal' },
      status: 'completed',
    },
    {
      id: '3',
      type: 'meeting',
      subject: 'Quarterly review',
      description: 'Quarterly business review meeting',
      date: '2023-10-17T09:00:00Z',
      duration: 60,
      owner: { firstName: 'Mike', lastName: 'Roberts' },
      relatedTo: 'account',
      relatedEntity: { name: 'Tech Solutions' },
      status: 'scheduled',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Activities</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Activity
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 py-2 sm:text-sm border-gray-300 rounded-md"
            placeholder="Search activities..."
          />
        </div>
      </div>

      {/* Activities Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <li key={activity.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-indigo-600 truncate">
                    {activity.subject}
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                      activity.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="mr-6 flex items-center text-sm text-gray-500">
                      <span className="capitalize">{activity.type}</span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <span>{activity.relatedEntity?.name}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <span>{new Date(activity.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <PencilIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
                    Edit
                  </button>
                  <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    <TrashIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Activities;