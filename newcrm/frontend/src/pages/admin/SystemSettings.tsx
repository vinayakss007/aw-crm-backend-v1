import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { Settings, Shield, Key, Globe, Mail, Database, Lock, AlertTriangle, CheckCircle } from 'lucide-react';

const AdminSystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'ABETWORKS CRM',
    companyLogo: '',
    defaultCurrency: 'USD',
    timezone: 'America/New_York',
    language: 'English',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour'
  });
  
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@abetworks-crm.com',
    fromName: 'ABETWORKS CRM',
    enableTLS: true
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    passwordRequireSpecialChar: true,
    passwordRequireNumber: true,
    passwordRequireUppercase: true,
    enableTwoFactorAuth: true,
    requirePasswordReset: false,
    accountLockoutTime: 30
  });
  
  const [customFields, setCustomFields] = useState([
    { id: '1', entity: 'lead', fieldName: 'referralSource', displayName: 'Referral Source', type: 'select', required: false, options: ['Trade Show', 'Web', 'Referral', 'Cold Call'] },
    { id: '2', entity: 'contact', fieldName: 'preferredContactMethod', displayName: 'Preferred Contact Method', type: 'select', required: false, options: ['Email', 'Phone', 'Mail'] }
  ]);
  
  const [newCustomField, setNewCustomField] = useState({
    entity: 'lead',
    fieldName: '',
    displayName: '',
    type: 'text',
    required: false,
    options: ''
  });

  const handleGeneralSave = () => {
    console.log('General settings updated:', generalSettings);
  };

  const handleEmailSave = () => {
    console.log('Email settings updated:', emailSettings);
  };

  const handleSecuritySave = () => {
    console.log('Security settings updated:', securitySettings);
  };

  const handleAddCustomField = () => {
    const optionsArray = newCustomField.options ? newCustomField.options.split(',').map(opt => opt.trim()) : [];
    const newField = {
      id: (customFields.length + 1).toString(),
      entity: newCustomField.entity,
      fieldName: newCustomField.fieldName,
      displayName: newCustomField.displayName,
      type: newCustomField.type,
      required: newCustomField.required,
      options: optionsArray
    };
    
    setCustomFields([...customFields, newField]);
    setNewCustomField({
      entity: 'lead',
      fieldName: '',
      displayName: '',
      type: 'text',
      required: false,
      options: ''
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure system-wide settings and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64">
          <Card>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('general')}
                className={`${
                  activeTab === 'general'
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left`}
              >
                <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
                General
              </button>
              
              <button
                onClick={() => setActiveTab('email')}
                className={`${
                  activeTab === 'email'
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left`}
              >
                <Mail className="mr-3 h-5 w-5 flex-shrink-0" />
                Email
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
                onClick={() => setActiveTab('customFields')}
                className={`${
                  activeTab === 'customFields'
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left`}
              >
                <Database className="mr-3 h-5 w-5 flex-shrink-0" />
                Custom Fields
              </button>
              
              <button
                onClick={() => setActiveTab('integrations')}
                className={`${
                  activeTab === 'integrations'
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left`}
              >
                <Globe className="mr-3 h-5 w-5 flex-shrink-0" />
                Integrations
              </button>
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <Card title="General Settings">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <Input
                      label="Company Name"
                      value={generalSettings.companyName}
                      onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <Input
                      label="Default Currency"
                      value={generalSettings.defaultCurrency}
                      onChange={(e) => setGeneralSettings({...generalSettings, defaultCurrency: e.target.value})}
                    />
                  </div>
                  
                  <div className="sm:col-span-3">
                    <Select
                      label="Timezone"
                      value={generalSettings.timezone}
                      onChange={(value) => setGeneralSettings({...generalSettings, timezone: value})}
                      options={[
                        { value: 'America/New_York', label: 'Eastern Time (ET)' },
                        { value: 'America/Chicago', label: 'Central Time (CT)' },
                        { value: 'America/Denver', label: 'Mountain Time (MT)' },
                        { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                        { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
                      ]}
                    />
                  </div>
                  
                  <div className="sm:col-span-3">
                    <Select
                      label="Language"
                      value={generalSettings.language}
                      onChange={(value) => setGeneralSettings({...generalSettings, language: value})}
                      options={[
                        { value: 'English', label: 'English' },
                        { value: 'Spanish', label: 'Spanish' },
                        { value: 'French', label: 'French' },
                        { value: 'German', label: 'German' },
                      ]}
                    />
                  </div>
                  
                  <div className="sm:col-span-3">
                    <Select
                      label="Date Format"
                      value={generalSettings.dateFormat}
                      onChange={(value) => setGeneralSettings({...generalSettings, dateFormat: value})}
                      options={[
                        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                        { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                      ]}
                    />
                  </div>
                  
                  <div className="sm:col-span-3">
                    <Select
                      label="Time Format"
                      value={generalSettings.timeFormat}
                      onChange={(value) => setGeneralSettings({...generalSettings, timeFormat: value})}
                      options={[
                        { value: '12-hour', label: '12-hour' },
                        { value: '24-hour', label: '24-hour' },
                      ]}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleGeneralSave}>
                    <Settings className="h-4 w-4 mr-1" />
                    Save General Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          {activeTab === 'email' && (
            <Card title="Email Settings">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <Input
                      label="SMTP Host"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="SMTP Port"
                      type="number"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="SMTP Username"
                      value={emailSettings.smtpUsername}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="SMTP Password"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="From Email Address"
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="From Name"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="enable-tls"
                      name="enable-tls"
                      type="checkbox"
                      checked={emailSettings.enableTLS}
                      onChange={(e) => setEmailSettings({...emailSettings, enableTLS: e.target.checked})}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="enable-tls" className="font-medium text-gray-700 dark:text-gray-300">
                      Enable TLS
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Enable Transport Layer Security for secure email transmission
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleEmailSave}>
                    <Mail className="h-4 w-4 mr-1" />
                    Save Email Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          {activeTab === 'security' && (
            <Card title="Security Settings">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <Input
                      label="Session Timeout (minutes)"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value) || 30})}
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="Max Login Attempts"
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value) || 5})}
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="Password Minimum Length"
                      type="number"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value) || 8})}
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="Account Lockout Time (minutes)"
                      type="number"
                      value={securitySettings.accountLockoutTime}
                      onChange={(e) => setSecuritySettings({...securitySettings, accountLockoutTime: parseInt(e.target.value) || 30})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Password Requirements</h3>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="require-special-char"
                        name="require-special-char"
                        type="checkbox"
                        checked={securitySettings.passwordRequireSpecialChar}
                        onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireSpecialChar: e.target.checked})}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="require-special-char" className="font-medium text-gray-700 dark:text-gray-300">
                        Require Special Character
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Passwords must contain at least one special character
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="require-number"
                        name="require-number"
                        type="checkbox"
                        checked={securitySettings.passwordRequireNumber}
                        onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireNumber: e.target.checked})}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="require-number" className="font-medium text-gray-700 dark:text-gray-300">
                        Require Number
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Passwords must contain at least one number
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="require-uppercase"
                        name="require-uppercase"
                        type="checkbox"
                        checked={securitySettings.passwordRequireUppercase}
                        onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireUppercase: e.target.checked})}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="require-uppercase" className="font-medium text-gray-700 dark:text-gray-300">
                        Require Uppercase Letter
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Passwords must contain at least one uppercase letter
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="enable-2fa"
                        name="enable-2fa"
                        type="checkbox"
                        checked={securitySettings.enableTwoFactorAuth}
                        onChange={(e) => setSecuritySettings({...securitySettings, enableTwoFactorAuth: e.target.checked})}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="enable-2fa" className="font-medium text-gray-700 dark:text-gray-300">
                        Enable Two-Factor Authentication
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Require 2FA for all user accounts
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="require-password-reset"
                        name="require-password-reset"
                        type="checkbox"
                        checked={securitySettings.requirePasswordReset}
                        onChange={(e) => setSecuritySettings({...securitySettings, requirePasswordReset: e.target.checked})}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="require-password-reset" className="font-medium text-gray-700 dark:text-gray-300">
                        Require Password Reset on Next Login
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Force users to change their passwords on next login
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSecuritySave}>
                    <Shield className="h-4 w-4 mr-1" />
                    Save Security Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          {activeTab === 'customFields' && (
            <Card title="Custom Fields">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Select
                    label="Entity"
                    value={newCustomField.entity}
                    onChange={(value) => setNewCustomField({...newCustomField, entity: value})}
                    options={[
                      { value: 'lead', label: 'Lead' },
                      { value: 'contact', label: 'Contact' },
                      { value: 'account', label: 'Account' },
                      { value: 'opportunity', label: 'Opportunity' },
                      { value: 'activity', label: 'Activity' },
                    ]}
                  />
                  
                  <Input
                    label="Field Name"
                    value={newCustomField.fieldName}
                    onChange={(e) => setNewCustomField({...newCustomField, fieldName: e.target.value})}
                    placeholder="e.g. referralSource"
                  />
                  
                  <Input
                    label="Display Name"
                    value={newCustomField.displayName}
                    onChange={(e) => setNewCustomField({...newCustomField, displayName: e.target.value})}
                    placeholder="e.g. Referral Source"
                  />
                  
                  <Select
                    label="Field Type"
                    value={newCustomField.type}
                    onChange={(value) => setNewCustomField({...newCustomField, type: value})}
                    options={[
                      { value: 'text', label: 'Text' },
                      { value: 'number', label: 'Number' },
                      { value: 'date', label: 'Date' },
                      { value: 'boolean', label: 'Boolean' },
                      { value: 'select', label: 'Select' },
                      { value: 'multiselect', label: 'Multi-select' },
                    ]}
                  />
                  
                  <div className="sm:col-span-2">
                    <Input
                      label="Options (comma-separated for select/multiselect)"
                      value={newCustomField.options}
                      onChange={(e) => setNewCustomField({...newCustomField, options: e.target.value})}
                      placeholder="e.g. Trade Show, Web, Referral, Cold Call"
                    />
                  </div>
                  
                  <div className="flex items-center h-5 sm:col-span-2">
                    <input
                      id="required-field"
                      name="required-field"
                      type="checkbox"
                      checked={newCustomField.required}
                      onChange={(e) => setNewCustomField({...newCustomField, required: e.target.checked})}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="required-field" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Required Field
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleAddCustomField}>
                    <Database className="h-4 w-4 mr-1" />
                    Add Custom Field
                  </Button>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Existing Custom Fields</h3>
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Entity</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Field Name</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Required</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Options</th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                        {customFields.map((field) => (
                          <tr key={field.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6 capitalize">{field.entity}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{field.displayName}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 capitalize">{field.type}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                              {field.required ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <span className="text-gray-500">No</span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                              {field.options && field.options.length > 0 ? field.options.join(', ') : '-'}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Card>
          )}
          
          {activeTab === 'integrations' && (
            <Card title="Integrations">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                        <Globe className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Webhooks</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Configure outbound webhooks for real-time data sync</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        Configure Webhooks
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                        <Database className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Data Import/Export</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Bulk import and export tools for data management</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        Manage Data Tools
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                        <AlertTriangle className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Audit Logs</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">View and analyze system activity logs</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        View Audit Logs
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300">
                        <Lock className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Backup & Recovery</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Configure automated backups and recovery options</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        Configure Backup
                      </Button>
                    </div>
                  </Card>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <Globe className="h-4 w-4 mr-1" />
                    Save Integration Settings
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

export default AdminSystemSettings;