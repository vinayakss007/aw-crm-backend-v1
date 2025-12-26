import React, { useState } from 'react';
import { useGetLeadsQuery, useCreateLeadMutation } from '../services/apiSlice';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';

const Leads: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  const { data: leadsResponse, isLoading, error, refetch } = useGetLeadsQuery({ 
    page: 1, 
    limit: 100,
    search: searchTerm,
    status: statusFilter
  });
  
  const [createLead, { isLoading: isCreating }] = useCreateLeadMutation();
  
  const [newLead, setNewLead] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    status: 'new',
    leadSource: 'Web'
  });

  const leads = leadsResponse?.data || [];

  const handleCreateLead = async () => {
    try {
      await createLead(newLead).unwrap();
      setNewLead({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        phone: '',
        status: 'new',
        leadSource: 'Web'
      });
      setShowCreateModal(false);
      refetch();
    } catch (err) {
      console.error('Failed to create lead:', err);
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
    { key: 'firstName', title: 'Name', sortable: true },
    { key: 'company', title: 'Company', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'phone', title: 'Phone', sortable: true },
    { key: 'status', title: 'Status', sortable: true },
    { key: 'leadSource', title: 'Source', sortable: true },
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
          <div className="text-sm text-red-700">Error loading leads data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads Management</h1>
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
                placeholder="Search leads..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'new', label: 'New' },
                { value: 'contacted', label: 'Contacted' },
                { value: 'qualified', label: 'Qualified' },
                { value: 'unqualified', label: 'Unqualified' },
                { value: 'closed', label: 'Closed' },
              ]}
            />
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
              Add Lead
            </Button>
          </div>
        </div>
      </Card>

      {/* Leads Table */}
      <Card>
        <DataTable
          columns={columns}
          data={leads}
          loading={isLoading}
          onSort={handleSort}
          currentSort={sortConfig}
          onRowClick={(lead) => console.log('Lead clicked:', lead)}
        />
      </Card>

      {/* Create Lead Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Lead"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <Input
              label="First Name"
              value={newLead.firstName}
              onChange={(e) => setNewLead({...newLead, firstName: e.target.value})}
              required
            />
            <Input
              label="Last Name"
              value={newLead.lastName}
              onChange={(e) => setNewLead({...newLead, lastName: e.target.value})}
              required
            />
          </div>
          
          <Input
            label="Email"
            type="email"
            value={newLead.email}
            onChange={(e) => setNewLead({...newLead, email: e.target.value})}
            required
          />
          
          <Input
            label="Company"
            value={newLead.company}
            onChange={(e) => setNewLead({...newLead, company: e.target.value})}
          />
          
          <Input
            label="Phone"
            value={newLead.phone}
            onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
          />
          
          <Select
            label="Status"
            value={newLead.status}
            onChange={(value) => setNewLead({...newLead, status: value})}
            options={[
              { value: 'new', label: 'New' },
              { value: 'contacted', label: 'Contacted' },
              { value: 'qualified', label: 'Qualified' },
              { value: 'unqualified', label: 'Unqualified' },
              { value: 'closed', label: 'Closed' },
            ]}
          />
          
          <Select
            label="Lead Source"
            value={newLead.leadSource}
            onChange={(value) => setNewLead({...newLead, leadSource: value})}
            options={[
              { value: 'Web', label: 'Web' },
              { value: 'Referral', label: 'Referral' },
              { value: 'Cold Call', label: 'Cold Call' },
              { value: 'Trade Show', label: 'Trade Show' },
              { value: 'Advertisement', label: 'Advertisement' },
            ]}
          />
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateLead} 
            loading={isCreating}
            disabled={isCreating}
          >
            Create Lead
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Leads;