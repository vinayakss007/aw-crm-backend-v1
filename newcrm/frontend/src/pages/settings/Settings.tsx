import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { User, Mail, Shield, Bell, Globe, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0101',
    jobTitle: 'Sales Manager',
    department: 'Sales',
    timezone: 'America/New_York',
    language: 'English'
  });
  
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileSave = () => {
    console.log('Profile updated:', profile);
    // In a real app, this would call an API
  };

  const handleSecuritySave = () => {
    console.log('Security settings updated');
    // In a real app, this would call an API
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64">
          <Card>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`${
                  activeTab === 'profile'
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left`}
              >
                <User className="mr-3 h-5 w-5 flex-shrink-0" />
                Profile
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`${
                  activeTab === 'notifications'
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left`}
              >
                <Bell className="mr-3 h-5 w-5 flex-shrink-0" />
                Notifications
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`${
                  activeTab === 'security'
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left`}
              >
                <Shield className="mr-3 h-5 w-5 flex-shrink-0" />
                Security
              </button>
              
              <button
                onClick={() => setActiveTab('preferences')}
                className={`${
                  activeTab === 'preferences'
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left`}
              >
                <Globe className="mr-3 h-5 w-5 flex-shrink-0" />
                Preferences
              </button>
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card title="Profile Information">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <Input
                      label="First name"
                      value={profile.firstName}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    />
                  </div>
                  
                  <div className="sm:col-span-3">
                    <Input
                      label="Last name"
                      value={profile.lastName}
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    />
                  </div>
                  
                  <div className="sm:col-span-4">
                    <Input
                      label="Email address"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="sm:col-span-4">
                    <Input
                      label="Phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  </div>
                  
                  <div className="sm:col-span-3">
                    <Input
                      label="Job title"
                      value={profile.jobTitle}
                      onChange={(e) => setProfile({...profile, jobTitle: e.target.value})}
                    />
                  </div>
                  
                  <div className="sm:col-span-3">
                    <Input
                      label="Department"
                      value={profile.department}
                      onChange={(e) => setProfile({...profile, department: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleProfileSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Save Profile
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          {activeTab === 'notifications' && (
            <Card title="Notification Settings">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="email-notifications"
                      name="email-notifications"
                      type="checkbox"
                      defaultChecked
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="email-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                      Email notifications
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Receive notifications via email
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="push-notifications"
                      name="push-notifications"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="push-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                      Push notifications
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Receive push notifications on your device
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="sms-notifications"
                      name="sms-notifications"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="sms-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                      SMS notifications
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Receive notifications via SMS
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-1" />
                    Save Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          {activeTab === 'security' && (
            <Card title="Security Settings">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input
                    label="Current password"
                    type="password"
                    value={security.currentPassword}
                    onChange={(e) => setSecurity({...security, currentPassword: e.target.value})}
                  />
                  
                  <Input
                    label="New password"
                    type="password"
                    value={security.newPassword}
                    onChange={(e) => setSecurity({...security, newPassword: e.target.value})}
                  />
                  
                  <Input
                    label="Confirm new password"
                    type="password"
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity({...security, confirmPassword: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSecuritySave}>
                    <Save className="h-4 w-4 mr-1" />
                    Change Password
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          {activeTab === 'preferences' && (
            <Card title="Preferences">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Select
                    label="Language"
                    value={profile.language}
                    onChange={(value) => setProfile({...profile, language: value})}
                    options={[
                      { value: 'English', label: 'English' },
                      { value: 'Spanish', label: 'Spanish' },
                      { value: 'French', label: 'French' },
                      { value: 'German', label: 'German' },
                    ]}
                  />
                  
                  <Select
                    label="Timezone"
                    value={profile.timezone}
                    onChange={(value) => setProfile({...profile, timezone: value})}
                    options={[
                      { value: 'America/New_York', label: 'Eastern Time (ET)' },
                      { value: 'America/Chicago', label: 'Central Time (CT)' },
                      { value: 'America/Denver', label: 'Mountain Time (MT)' },
                      { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                    ]}
                  />
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="dark-mode"
                      name="dark-mode"
                      type="checkbox"
                      defaultChecked
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="dark-mode" className="font-medium text-gray-700 dark:text-gray-300">
                      Dark mode
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Enable dark theme for the application
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-1" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;