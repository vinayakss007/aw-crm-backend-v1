import React, { useState } from 'react';
import { useGetAccountsQuery, useCreateAccountMutation } from '../services/apiSlice';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';

const Accounts: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  const { data: accounts, isLoading, error, refetch } = useGetAccountsQuery();
  const [createAccount, { isLoading: isCreating }] = useCreateAccountMutation();
  
  const [newAccount, setNewAccount] = useState({
    name: '',
    description: '',
    industry: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    size: 'Small',
    annualRevenue: 0
  });

  const handleCreateAccount = async () => {
    try {
      await createAccount(newAccount).unwrap();
      setNewAccount({
        name: '',
        description: '',
        industry: '',
        website: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
        size: 'Small',
        annualRevenue: 0
      });
      setShowCreateModal(false);
      refetch();
    } catch (err) {
      console.error('Failed to create account:', err);
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
    { key: 'name', title: 'Name', sortable: true },
    { key: 'industry', title: 'Industry', sortable: true },
    { key: 'website', title: 'Website', sortable: true },
    { key: 'phone', title: 'Phone', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'size', title: 'Size', sortable: true },
    { key: 'annualRevenue', title: 'Annual Revenue', sortable: true },
  ];

  // Mock data since we don't have real data yet
  const mockAccounts = [
    {
      id: '1',
      name: 'Acme Corporation',
      description: 'Manufacturing company',
      industry: 'Manufacturing',
      website: 'https://acme.com',
      phone: '+1-555-0101',
      email: 'contact@acme.com',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      size: 'Large',
      annualRevenue: 10000000
    },
    {
      id: '2',
      name: 'XYZ Ltd',
      description: 'Technology services',
      industry: 'Technology',
      website: 'https://xyz.com',
      phone: '+1-555-0102',
      email: 'info@xyz.com',
      address: '456 Oak Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
      size: 'Medium',
      annualRevenue: 5000000
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
          <div className="text-sm text-red-700">Error loading accounts data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Accounts Management</h1>
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
                placeholder="Search accounts..."
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
              Add Account
            </Button>
          </div>
        </div>
      </Card>

      {/* Accounts Table */}
      <Card>
        <DataTable
          columns={columns}
          data={accounts || mockAccounts}
          loading={isLoading}
          onSort={handleSort}
          currentSort={sortConfig}
          onRowClick={(account) => console.log('Account clicked:', account)}
        />
      </Card>

      {/* Create Account Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Account"
      >
        <div className="space-y-4">
          <Input
            label="Account Name"
            value={newAccount.name}
            onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
            required
          />
          
          <Input
            label="Description"
            value={newAccount.description}
            onChange={(e) => setNewAccount({...newAccount, description: e.target.value})}
          />
          
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <Select
              label="Industry"
              value={newAccount.industry}
              onChange={(value) => setNewAccount({...newAccount, industry: value})}
              options={[
                { value: 'Technology', label: 'Technology' },
                { value: 'Manufacturing', label: 'Manufacturing' },
                { value: 'Healthcare', label: 'Healthcare' },
                { value: 'Finance', label: 'Finance' },
                { value: 'Retail', label: 'Retail' },
                { value: 'Education', label: 'Education' },
                { value: 'Other', label: 'Other' },
              ]}
            />
            <Input
              label="Website"
              type="url"
              value={newAccount.website}
              onChange={(e) => setNewAccount({...newAccount, website: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <Input
              label="Phone"
              value={newAccount.phone}
              onChange={(e) => setNewAccount({...newAccount, phone: e.target.value})}
            />
            <Input
              label="Email"
              type="email"
              value={newAccount.email}
              onChange={(e) => setNewAccount({...newAccount, email: e.target.value})}
            />
          </div>
          
          <Input
            label="Address"
            value={newAccount.address}
            onChange={(e) => setNewAccount({...newAccount, address: e.target.value})}
          />
          
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-3">
            <Input
              label="City"
              value={newAccount.city}
              onChange={(e) => setNewAccount({...newAccount, city: e.target.value})}
            />
            <Input
              label="State"
              value={newAccount.state}
              onChange={(e) => setNewAccount({...newAccount, state: e.target.value})}
            />
            <Input
              label="ZIP Code"
              value={newAccount.zipCode}
              onChange={(e) => setNewAccount({...newAccount, zipCode: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <Select
              label="Country"
              value={newAccount.country}
              onChange={(value) => setNewAccount({...newAccount, country: value})}
              options={[
                { value: 'USA', label: 'USA' },
                { value: 'Canada', label: 'Canada' },
                { value: 'UK', label: 'UK' },
                { value: 'Germany', label: 'Germany' },
                { value: 'France', label: 'France' },
                { value: 'Other', label: 'Other' },
              ]}
            />
            <Select
              label="Size"
              value={newAccount.size}
              onChange={(value) => setNewAccount({...newAccount, size: value})}
              options={[
                { value: 'Small', label: 'Small (1-50)' },
                { value: 'Medium', label: 'Medium (51-500)' },
                { value: 'Large', label: 'Large (501+)' },
              ]}
            />
          </div>
          
          <Input
            label="Annual Revenue"
            type="number"
            value={newAccount.annualRevenue}
            onChange={(e) => setNewAccount({...newAccount, annualRevenue: parseFloat(e.target.value) || 0})}
          />
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateAccount} 
            loading={isCreating}
            disabled={isCreating}
          >
            Create Account
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Accounts;