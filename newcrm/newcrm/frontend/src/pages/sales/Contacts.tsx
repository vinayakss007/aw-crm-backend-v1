import React, { useState } from 'react';
import { useGetContactsQuery, useCreateContactMutation } from '../services/apiSlice';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';

const Contacts: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  const { data: contacts, isLoading, error, refetch } = useGetContactsQuery();
  const [createContact, { isLoading: isCreating }] = useCreateContactMutation();
  
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
    accountId: '',
    status: 'active',
    leadSource: 'Web'
  });

  const handleCreateContact = async () => {
    try {
      await createContact(newContact).unwrap();
      setNewContact({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        jobTitle: '',
        department: '',
        accountId: '',
        status: 'active',
        leadSource: 'Web'
      });
      setShowCreateModal(false);
      refetch();
    } catch (err) {
      console.error('Failed to create contact:', err);
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
    { key: 'firstName', title: 'First Name', sortable: true },
    { key: 'lastName', title: 'Last Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'phone', title: 'Phone', sortable: true },
    { key: 'jobTitle', title: 'Job Title', sortable: true },
    { key: 'department', title: 'Department', sortable: true },
    { key: 'status', title: 'Status', sortable: true },
  ];

  // Mock data since we don't have real data yet
  const mockContacts = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0101',
      jobTitle: 'CEO',
      department: 'Executive',
      accountId: 'Account 1',
      status: 'active',
      leadSource: 'Web'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1-555-0102',
      jobTitle: 'CTO',
      department: 'Technology',
      accountId: 'Account 2',
      status: 'active',
      leadSource: 'Referral'
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
          <div className="text-sm text-red-700">Error loading contacts data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contacts Management</h1>
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
                placeholder="Search contacts..."
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
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" />
              Import
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Contact
            </Button>
          </div>
        </div>
      </Card>

      {/* Contacts Table */}
      <Card>
        <DataTable
          columns={columns}
          data={contacts || mockContacts}
          loading={isLoading}
          onSort={handleSort}
          currentSort={sortConfig}
          onRowClick={(contact) => console.log('Contact clicked:', contact)}
        />
      </Card>

      {/* Create Contact Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Contact"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <Input
              label="First Name"
              value={newContact.firstName}
              onChange={(e) => setNewContact({...newContact, firstName: e.target.value})}
              required
            />
            <Input
              label="Last Name"
              value={newContact.lastName}
              onChange={(e) => setNewContact({...newContact, lastName: e.target.value})}
              required
            />
          </div>
          
          <Input
            label="Email"
            type="email"
            value={newContact.email}
            onChange={(e) => setNewContact({...newContact, email: e.target.value})}
            required
          />
          
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <Input
              label="Phone"
              value={newContact.phone}
              onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
            />
            <Input
              label="Job Title"
              value={newContact.jobTitle}
              onChange={(e) => setNewContact({...newContact, jobTitle: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <Input
              label="Department"
              value={newContact.department}
              onChange={(e) => setNewContact({...newContact, department: e.target.value})}
            />
            <Input
              label="Account ID"
              value={newContact.accountId}
              onChange={(e) => setNewContact({...newContact, accountId: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <Select
              label="Status"
              value={newContact.status}
              onChange={(value) => setNewContact({...newContact, status: value})}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'lead', label: 'Lead' },
              ]}
            />
            <Select
              label="Lead Source"
              value={newContact.leadSource}
              onChange={(value) => setNewContact({...newContact, leadSource: value})}
              options={[
                { value: 'Web', label: 'Web' },
                { value: 'Referral', label: 'Referral' },
                { value: 'Cold Call', label: 'Cold Call' },
                { value: 'Trade Show', label: 'Trade Show' },
                { value: 'Advertisement', label: 'Advertisement' },
              ]}
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateContact} 
            loading={isCreating}
            disabled={isCreating}
          >
            Create Contact
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Contacts;