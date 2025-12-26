import React, { useState } from 'react';
import { useGetUsersQuery, useUpdateUserMutation } from '../services/apiSlice';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { Plus, Search, Filter, Download, Upload, UserPlus } from 'lucide-react';

const AdminUsers: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  const { data: usersResponse, isLoading, error, refetch } = useGetUsersQuery({ 
    page: 1, 
    limit: 100 
  });
  
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    password: ''
  });

  const users = usersResponse?.data || [];

  const handleCreateUser = async () => {
    // In a real app, this would call the API to create a user
    console.log('Creating user:', newUser);
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      role: 'user',
      password: ''
    });
    setShowCreateModal(false);
    // refetch();
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
    { key: 'email', title: 'Email', sortable: true },
    { key: 'role', title: 'Role', sortable: true },
    { key: 'status', title: 'Status', sortable: true },
    { key: 'createdAt', title: 'Created', sortable: true },
    { key: 'lastActive', title: 'Last Active', sortable: true },
  ];

  // Mock data since we don't have real data yet
  const mockUsers = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      role: 'admin',
      status: 'active',
      createdAt: '2023-01-01',
      lastActive: '2 minutes ago'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      role: 'sales',
      status: 'active',
      createdAt: '2023-01-15',
      lastActive: '1 hour ago'
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@example.com',
      role: 'user',
      status: 'inactive',
      createdAt: '2023-02-01',
      lastActive: '1 week ago'
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
          <div className="text-sm text-red-700">Error loading users data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
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
                placeholder="Search users..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select
              label="Role"
              value={roleFilter}
              onChange={setRoleFilter}
              options={[
                { value: '', label: 'All Roles' },
                { value: 'admin', label: 'Admin' },
                { value: 'manager', label: 'Manager' },
                { value: 'user', label: 'User' },
                { value: 'sales', label: 'Sales' },
              ]}
            />
            
            <Select
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
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
              <UserPlus className="h-4 w-4 mr-1" />
              Add User
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <DataTable
          columns={columns}
          data={users || mockUsers}
          loading={isLoading}
          onSort={handleSort}
          currentSort={sortConfig}
          onRowClick={(user) => console.log('User clicked:', user)}
        />
      </Card>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New User"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <Input
              label="First Name"
              value={newUser.firstName}
              onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
              required
            />
            <Input
              label="Last Name"
              value={newUser.lastName}
              onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
              required
            />
          </div>
          
          <Input
            label="Email"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            required
          />
          
          <Input
            label="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            required
          />
          
          <Select
            label="Role"
            value={newUser.role}
            onChange={(value) => setNewUser({...newUser, role: value})}
            options={[
              { value: 'user', label: 'User' },
              { value: 'sales', label: 'Sales Rep' },
              { value: 'manager', label: 'Manager' },
              { value: 'admin', label: 'Admin' },
            ]}
          />
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateUser} 
            loading={isUpdating}
            disabled={isUpdating}
          >
            Create User
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;