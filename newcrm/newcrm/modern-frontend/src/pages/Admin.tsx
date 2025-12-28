import React, { useState } from 'react';
import { 
  UserGroupIcon, 
  KeyIcon, 
  ShieldCheckIcon, 
  CogIcon,
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '../services/userApi';
import { useGetRolesQuery, useCreateRoleMutation, useUpdateRoleMutation, useDeleteRoleMutation } from '../services/roleApi';
import { User, Role } from '../types';
import toast from 'react-hot-toast';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Users
  const { data: users = [], isLoading: usersLoading, isError: usersError, refetch: refetchUsers } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  // Roles
  const { data: roles = [], isLoading: rolesLoading, isError: rolesError, refetch: refetchRoles } = useGetRolesQuery();
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const [userFormData, setUserFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    department: '',
    position: '',
    phone: '',
    isActive: true,
  });

  const [roleFormData, setRoleFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setUserFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRoleFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await updateUser({ id: editingItem.id, ...userFormData }).unwrap();
        toast.success('User updated successfully');
      } else {
        await createUser(userFormData).unwrap();
        toast.success('User created successfully');
      }
      
      setIsModalOpen(false);
      setEditingItem(null);
      setUserFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: '',
        department: '',
        position: '',
        phone: '',
        isActive: true,
      });
      refetchUsers();
    } catch (error) {
      toast.error('Failed to save user');
      console.error('Error saving user:', error);
    }
  };

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await updateRole({ id: editingItem.id, ...roleFormData }).unwrap();
        toast.success('Role updated successfully');
      } else {
        await createRole(roleFormData).unwrap();
        toast.success('Role created successfully');
      }
      
      setIsModalOpen(false);
      setEditingItem(null);
      setRoleFormData({
        name: '',
        description: '',
        permissions: [],
      });
      refetchRoles();
    } catch (error) {
      toast.error('Failed to save role');
      console.error('Error saving role:', error);
    }
  };

  const handleUserEdit = (user: User) => {
    setEditingItem(user);
    setUserFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      department: user.department || '',
      position: user.position || '',
      phone: user.phone || '',
      isActive: user.isActive,
    });
    setIsModalOpen(true);
  };

  const handleRoleEdit = (role: Role) => {
    setEditingItem(role);
    setRoleFormData({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions,
    });
    setIsModalOpen(true);
  };

  const handleUserDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap();
        toast.success('User deleted successfully');
        refetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleRoleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(id).unwrap();
        toast.success('Role deleted successfully');
        refetchRoles();
      } catch (error) {
        toast.error('Failed to delete role');
        console.error('Error deleting role:', error);
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if ((activeTab === 'users' && usersLoading) || (activeTab === 'roles' && rolesLoading)) {
    return <div className="flex justify-center items-center h-64"><div className="spinner"></div></div>;
  }

  if ((activeTab === 'users' && usersError) || (activeTab === 'roles' && rolesError)) {
    return <div className="text-center text-red-500">Error loading data</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`${
              activeTab === 'users'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <UserGroupIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`${
              activeTab === 'roles'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <ShieldCheckIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
            Roles
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`${
              activeTab === 'permissions'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <KeyIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
            Permissions
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`${
              activeTab === 'settings'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <CogIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
            Settings
          </button>
        </nav>
      </div>

      {/* Search Bar */}
      <div className="mb-6 mt-6">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 py-2 sm:text-sm border-gray-300 rounded-md"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'users' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Users</h2>
            <button
              onClick={() => {
                setEditingItem(null);
                setUserFormData({
                  email: '',
                  firstName: '',
                  lastName: '',
                  role: '',
                  department: '',
                  position: '',
                  phone: '',
                  isActive: true,
                });
                setIsModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add User
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <li key={user.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-indigo-600 truncate">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <div className="mr-6 flex items-center text-sm text-gray-500">
                          <span>{user.email}</span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <span>{user.role}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span>{user.department || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => handleUserEdit(user)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <PencilIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleUserDelete(user.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
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
      )}

      {activeTab === 'roles' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Roles</h2>
            <button
              onClick={() => {
                setEditingItem(null);
                setRoleFormData({
                  name: '',
                  description: '',
                  permissions: [],
                });
                setIsModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Role
            </button>
          </div>

          {/* Roles Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredRoles.map((role) => (
                <li key={role.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-indigo-600 truncate">
                        {role.name}
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <div className="mr-6 flex items-center text-sm text-gray-500">
                          <span>{role.description || 'No description'}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span>{role.permissions.length} permissions</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => handleRoleEdit(role)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <PencilIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleRoleDelete(role.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
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
      )}

      {activeTab === 'permissions' && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Permissions</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              <li>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-indigo-600 truncate">
                      Manage Users
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <div className="mr-6 flex items-center text-sm text-gray-500">
                        <span>Allows creating, updating, and deleting users</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <span>Global</span>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-indigo-600 truncate">
                      Manage Leads
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <div className="mr-6 flex items-center text-sm text-gray-500">
                        <span>Allows creating, updating, and deleting leads</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <span>Global</span>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-indigo-600 truncate">
                      Manage Accounts
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <div className="mr-6 flex items-center text-sm text-gray-500">
                        <span>Allows creating, updating, and deleting accounts</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <span>Global</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">System Settings</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    defaultValue="ABETWORKS CRM"
                  />
                </div>
                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    name="timezone"
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option>(GMT-12:00) International Date Line West</option>
                    <option>(GMT-11:00) Midway Island, Samoa</option>
                    <option>(GMT-10:00) Hawaii</option>
                    <option>(GMT-09:00) Alaska</option>
                    <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                    <option>(GMT-07:00) Mountain Time (US & Canada)</option>
                    <option>(GMT-06:00) Central Time (US & Canada)</option>
                    <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                    <option>(GMT-04:00) Atlantic Time (Canada)</option>
                    <option>(GMT-03:00) Brazil, Buenos Aires</option>
                    <option>(GMT-02:00) Mid-Atlantic</option>
                    <option>(GMT-01:00) Azores, Cape Verde Islands</option>
                    <option>(GMT+00:00) Western Europe Time</option>
                    <option>(GMT+01:00) Central Europe Time</option>
                    <option>(GMT+02:00) Eastern Europe Time</option>
                    <option>(GMT+03:00) Moscow Time</option>
                    <option>(GMT+04:00) Abu Dhabi, Muscat</option>
                    <option>(GMT+05:00) Islamabad, Karachi</option>
                    <option>(GMT+06:00) Dhaka</option>
                    <option>(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                    <option>(GMT+08:00) Beijing, Singapore, Hong Kong</option>
                    <option>(GMT+09:00) Tokyo, Seoul, Osaka</option>
                    <option>(GMT+10:00) Eastern Australia, Guam</option>
                    <option>(GMT+11:00) Magadan, Solomon Islands</option>
                    <option>(GMT+12:00) Auckland, Wellington, Fiji</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                    Date Format
                  </label>
                  <select
                    id="dateFormat"
                    name="dateFormat"
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    id="enableNotifications"
                    name="enableNotifications"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enableNotifications" className="ml-2 block text-sm text-gray-900">
                    Enable email notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="enableTwoFactor"
                    name="enableTwoFactor"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enableTwoFactor" className="ml-2 block text-sm text-gray-900">
                    Require two-factor authentication
                  </label>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {editingItem 
                        ? (activeTab === 'users' ? 'Edit User' : 'Edit Role') 
                        : (activeTab === 'users' ? 'Add New User' : 'Add New Role')
                      }
                    </h3>
                    <div className="mt-4">
                      {activeTab === 'users' ? (
                        <form onSubmit={handleUserSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                First Name
                              </label>
                              <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={userFormData.firstName}
                                onChange={handleUserInputChange}
                                required
                              />
                            </div>
                            <div>
                              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                Last Name
                              </label>
                              <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={userFormData.lastName}
                                onChange={handleUserInputChange}
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={userFormData.email}
                              onChange={handleUserInputChange}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                Role
                              </label>
                              <select
                                name="role"
                                id="role"
                                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={userFormData.role}
                                onChange={handleUserInputChange}
                              >
                                <option value="">Select a role</option>
                                {roles.map(role => (
                                  <option key={role.id} value={role.name}>{role.name}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                id="phone"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={userFormData.phone}
                                onChange={handleUserInputChange}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                                Department
                              </label>
                              <input
                                type="text"
                                name="department"
                                id="department"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={userFormData.department}
                                onChange={handleUserInputChange}
                              />
                            </div>
                            <div>
                              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                                Position
                              </label>
                              <input
                                type="text"
                                name="position"
                                id="position"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={userFormData.position}
                                onChange={handleUserInputChange}
                              />
                            </div>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="isActive"
                              name="isActive"
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              checked={userFormData.isActive}
                              onChange={handleUserInputChange}
                            />
                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                              Active User
                            </label>
                          </div>
                        </form>
                      ) : (
                        <form onSubmit={handleRoleSubmit} className="space-y-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              Role Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={roleFormData.name}
                              onChange={handleRoleInputChange}
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <textarea
                              name="description"
                              id="description"
                              rows={3}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={roleFormData.description}
                              onChange={handleRoleInputChange}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Permissions
                            </label>
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center">
                                <input
                                  id="perm1"
                                  name="perm1"
                                  type="checkbox"
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="perm1" className="ml-2 block text-sm text-gray-900">
                                  Manage Users
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="perm2"
                                  name="perm2"
                                  type="checkbox"
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="perm2" className="ml-2 block text-sm text-gray-900">
                                  Manage Leads
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="perm3"
                                  name="perm3"
                                  type="checkbox"
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="perm3" className="ml-2 block text-sm text-gray-900">
                                  Manage Accounts
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="perm4"
                                  name="perm4"
                                  type="checkbox"
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="perm4" className="ml-2 block text-sm text-gray-900">
                                  Manage Opportunities
                                </label>
                              </div>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={activeTab === 'users' ? handleUserSubmit : handleRoleSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;