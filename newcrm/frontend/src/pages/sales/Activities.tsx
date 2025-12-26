import React, { useState } from 'react';
import { useGetActivitiesQuery, useCreateActivityMutation } from '../services/apiSlice';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { Plus, Search, Filter, Calendar, Clock } from 'lucide-react';

const Activities: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  const { data: activities, isLoading, error, refetch } = useGetActivitiesQuery();
  const [createActivity, { isLoading: isCreating }] = useCreateActivityMutation();
  
  const [newActivity, setNewActivity] = useState({
    subject: '',
    type: 'Call',
    description: '',
    status: 'Planned',
    priority: 'Normal',
    startDate: '',
    endDate: '',
    accountId: '',
    contactId: '',
    opportunityId: ''
  });

  const handleCreateActivity = async () => {
    try {
      await createActivity(newActivity).unwrap();
      setNewActivity({
        subject: '',
        type: 'Call',
        description: '',
        status: 'Planned',
        priority: 'Normal',
        startDate: '',
        endDate: '',
        accountId: '',
        contactId: '',
        opportunityId: ''
      });
      setShowCreateModal(false);
      refetch();
    } catch (err) {
      console.error('Failed to create activity:', err);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const columns = [
    { key: 'subject', title: 'Subject', sortable: true },
    { key: 'type', title: 'Type', sortable: true },
    { key: 'status', title: 'Status', sortable: true },
    { key: 'priority', title: 'Priority', sortable: true },
    { key: 'startDate', title: 'Start Date', sortable: true },
    { key: 'endDate', title: 'End Date', sortable: true },
    { key: 'accountId', title: 'Account', sortable: true },
  ];

  // Mock data since we don't have real data yet
  const mockActivities = [
    {
      id: '1',
      subject: 'Follow up call with Acme',
      type: 'Call',
      description: 'Follow up on proposal',
      status: 'Planned',
      priority: 'High',
      startDate: '2023-01-02T10:00:00.000Z',
      endDate: '2023-01-02T11:00:00.000Z',
      accountId: 'Account 1',
      contactId: 'Contact 1',
      opportunityId: 'Opportunity 1'
    },
    {
      id: '2',
      subject: 'Meeting with XYZ',
      type: 'Meeting',
      description: 'Quarterly review',
      status: 'Completed',
      priority: 'Normal',
      startDate: '2023-01-03T14:00:00.000Z',
      endDate: '2023-01-03T15:30:00.000Z',
      accountId: 'Account 2',
      contactId: 'Contact 2',
      opportunityId: 'Opportunity 2'
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">Error loading activities data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activities Management</h1>
      </div>

      {/* Controls */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search activities..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-1" />
              Calendar View
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Activity
            </Button>
          </div>
        </div>
      </Card>

      {/* Activities Table */}
      <Card>
        <DataTable
          columns={columns}
          data={activities || mockActivities}
          loading={isLoading}
          onSort={handleSort}
          currentSort={sortConfig}
          onRowClick={(activity) => console.log('Activity clicked:', activity)}
        />
      </Card>

      {/* Create Activity Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Activity"
      >
        <div className="space-y-4">
          <Input
            label="Subject"
            value={newActivity.subject}
            onChange={(e) => setNewActivity({...newActivity, subject: e.target.value})}
            required
          />
          
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <Select
              label="Type"
              value={newActivity.type}
              onChange={(value) => setNewActivity({...newActivity, type: value})}
              options={[
                { value: 'Call', label: 'Call' },
                { value: 'Meeting', label: 'Meeting' },
                { value: 'Email', label: 'Email' },
                { value: 'Task', label: 'Task' },
                { value: 'Note', label: 'Note' },
              ]}
            />
            <Select
              label="Status"
              value={newActivity.status}
              onChange={(value) => setNewActivity({...newActivity, status: value})}
              options={[
                { value: 'Planned', label: 'Planned' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Cancelled', label: 'Cancelled' },
              ]}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <Select
              label="Priority"
              value={newActivity.priority}
              onChange={(value) => setNewActivity({...newActivity, priority: value})}
              options={[
                { value: 'Low', label: 'Low' },
                { value: 'Normal', label: 'Normal' },
                { value: 'High', label: 'High' },
                { value: 'Urgent', label: 'Urgent' },
              ]}
            />
            <Input
              label="Account ID"
              value={newActivity.accountId}
              onChange={(e) => setNewActivity({...newActivity, accountId: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <Input
              label="Contact ID"
              value={newActivity.contactId}
              onChange={(e) => setNewActivity({...newActivity, contactId: e.target.value})}
            />
            <Input
              label="Opportunity ID"
              value={newActivity.opportunityId}
              onChange={(e) => setNewActivity({...newActivity, opportunityId: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <div>
              <label className="form-label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date & Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  value={newActivity.startDate}
                  onChange={(e) => setNewActivity({...newActivity, startDate: e.target.value})}
                  className="form-control pl-10"
                />
              </div>
            </div>
            <div>
              <label className="form-label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date & Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  value={newActivity.endDate}
                  onChange={(e) => setNewActivity({...newActivity, endDate: e.target.value})}
                  className="form-control pl-10"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="form-label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={newActivity.description}
              onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
              rows={3}
              className="form-control w-full"
              placeholder="Add details about the activity..."
            ></textarea>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateActivity} 
            loading={isCreating}
            disabled={isCreating}
          >
            Create Activity
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Activities;