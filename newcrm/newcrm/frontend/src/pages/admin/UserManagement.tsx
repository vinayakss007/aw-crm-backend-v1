import React, { useState } from 'react';
import { useGetUsersQuery, useUpdateUserMutation, useDeleteUserMutation } from '../services/apiSlice';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { Plus, Search, Filter, Download, Upload, UserPlus, Shield, Key, Settings, Eye, Edit, Trash2 } from 'lucide-react';

const AdminUserManagement: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  const { data: usersResponse, isLoading, error, refetch } = useGetUsersQuery({ 
    page: 1, 
    limit: 100 
  });
  
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    password: '',
    isActive: true
  });
  const [apiKey, setApiKey] = useState('');

  const users = usersResponse?.data || [];

  const handleCreateUser = async () => {
    // In a real app, this would call the API to create a user
    console.log('Creating user:', newUser);
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      role: 'user',
      password: '',
      isActive: true
    });
    setShowCreateModal(false);
    // refetch();
  };

  const handleUpdateUser = async () => {
    if (currentUser) {
      try {
        await updateUser({ id: currentUser.id, ...currentUser }).unwrap();
        setShowEditModal(false);
        refetch();
      } catch (err) {
        console.error('Failed to update user:', err);
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap();
        refetch();
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const generateApiKey = () => {
    const newKey = 'sk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
  };

  const columns = [
    { key: 'firstName', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'role', title: 'Role', sortable: true },
    { key: 'isActive', title: 'Status', sortable: true, render: (value: boolean) => (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {value ? 'Active' : 'Inactive'}
      </span>
    )},
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
      isActive: true,
      createdAt: '2023-01-01',
      lastActive: '2 minutes ago'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      role: 'sales',
      isActive: true,
      createdAt: '2023-01-15',
      lastActive: '1 hour ago'
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@example.com',
      role: 'user',
      isActive: false,
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage users, roles, and permissions</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowApiKeyModal(true)}>
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
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
                { value: 'sales', label: 'Sales' },
                { value: 'user', label: 'User' },
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
          onRowClick={(user) => {
            setCurrentUser(user);
            setShowEditModal(true);
          }}
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
          
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
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
            <Select
              label="Status"
              value={newUser.isActive ? 'active' : 'inactive'}
              onChange={(value) => setNewUser({...newUser, isActive: value === 'active'})}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </div>
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

      {/* Edit User Modal */}
      {currentUser && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={`Edit User: ${currentUser.firstName} ${currentUser.lastName}`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
              <Input
                label="First Name"
                value={currentUser.firstName || ''}
                onChange={(e) => setCurrentUser({...currentUser, firstName: e.target.value})}
              />
              <Input
                label="Last Name"
                value={currentUser.lastName || ''}
                onChange={(e) => setCurrentUser({...currentUser, lastName: e.target.value})}
              />
            </div>
            
            <Input
              label="Email"
              type="email"
              value={currentUser.email || ''}
              onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
            />
            
            <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
              <Select
                label="Role"
                value={currentUser.role || 'user'}
                onChange={(value) => setCurrentUser({...currentUser, role: value})}
                options={[
                  { value: 'user', label: 'User' },
                  { value: 'sales', label: 'Sales Rep' },
                  { value: 'manager', label: 'Manager' },
                  { value: 'admin', label: 'Admin' },
                ]}
              />
              <Select
                label="Status"
                value={currentUser.isActive ? 'active' : 'inactive'}
                onChange={(value) => setCurrentUser({...currentUser, isActive: value === 'active'})}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => handleDeleteUser(currentUser.id)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete User
            </Button>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateUser} 
                loading={isUpdating}
                disabled={isUpdating}
              >
                Update User
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* API Key Modal */}
      <Modal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        title="API Key Management"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Generate New API Key</h3>
            <div className="flex items-center">
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="API Key will be generated here"
                className="flex-1"
              />
              <Button 
                className="ml-2" 
                onClick={generateApiKey}
              >
                Generate
              </Button>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Copy this key and store it securely. You won't be able to see it again.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Existing API Keys</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="font-medium">sk_abc123def456...</span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="font-medium">sk_def456ghi789...</span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setShowApiKeyModal(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUserManagement;