import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Tabs from '../components/common/Tabs';
import DataTable from '../components/common/DataTable';
import { User, Mail, Phone, FileText, CreditCard, Ticket, MessageSquare, Settings, Eye, Download, Calendar, Clock } from 'lucide-react';

const CustomerPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock customer data
  const customer = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0101',
    company: 'ABC Corporation',
    address: '123 Main St, New York, NY 10001',
    status: 'Active',
    joinDate: '2023-01-15',
    lastContact: '2023-12-01'
  };
  
  // Mock orders
  const orders = [
    { id: 'ORD-001', product: 'Premium Plan', date: '2023-11-15', amount: 299.00, status: 'Shipped' },
    { id: 'ORD-002', product: 'Support Package', date: '2023-10-20', amount: 199.00, status: 'Delivered' },
    { id: 'ORD-003', product: 'Consultation', date: '2023-09-05', amount: 499.00, status: 'Completed' }
  ];
  
  // Mock tickets
  const tickets = [
    { id: 'TKT-001', subject: 'Billing Inquiry', status: 'Open', priority: 'High', date: '2023-12-01' },
    { id: 'TKT-002', subject: 'Feature Request', status: 'In Progress', priority: 'Medium', date: '2023-11-25' },
    { id: 'TKT-003', subject: 'Bug Report', status: 'Resolved', priority: 'Low', date: '2023-11-15' }
  ];
  
  // Mock invoices
  const invoices = [
    { id: 'INV-001', date: '2023-11-01', amount: 299.00, status: 'Paid', dueDate: '2023-11-15' },
    { id: 'INV-002', date: '2023-12-01', amount: 199.00, status: 'Pending', dueDate: '2023-12-15' }
  ];

  // Tab configuration
  const tabs = [
    {
      id: 'profile',
      label: 'My Information',
      content: (
        <div className="space-y-6">
          <Card title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{customer.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{customer.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{customer.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{customer.company}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{customer.address}</p>
              </div>
            </div>
          </Card>

          <Card title="Account Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{customer.status}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Join Date</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{customer.joinDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Contact</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{customer.lastContact}</p>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button>
              <Settings className="h-4 w-4 mr-1" />
              Edit Profile
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 'orders',
      label: 'My Orders',
      content: (
        <div className="space-y-6">
          <Card>
            <DataTable
              columns={[
                { key: 'id', title: 'Order ID', sortable: true },
                { key: 'product', title: 'Product', sortable: true },
                { key: 'date', title: 'Date', sortable: true },
                { key: 'amount', title: 'Amount', sortable: true, render: (value: number) => `$${value.toFixed(2)}` },
                { key: 'status', title: 'Status', sortable: true },
              ]}
              data={orders}
              onRowClick={(order) => console.log('Order clicked:', order)}
            />
          </Card>
        </div>
      )
    },
    {
      id: 'tickets',
      label: 'Support Tickets',
      content: (
        <div className="space-y-6">
          <Card>
            <div className="flex justify-end mb-4">
              <Button>
                <MessageSquare className="h-4 w-4 mr-1" />
                Create Ticket
              </Button>
            </div>
            <DataTable
              columns={[
                { key: 'id', title: 'Ticket ID', sortable: true },
                { key: 'subject', title: 'Subject', sortable: true },
                { key: 'status', title: 'Status', sortable: true },
                { key: 'priority', title: 'Priority', sortable: true },
                { key: 'date', title: 'Date', sortable: true },
              ]}
              data={tickets}
              onRowClick={(ticket) => console.log('Ticket clicked:', ticket)}
            />
          </Card>
        </div>
      )
    },
    {
      id: 'billing',
      label: 'Billing & Invoices',
      content: (
        <div className="space-y-6">
          <Card title="Payment Methods">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                <CreditCard className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Visa ending in 1234</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Expires 12/2025</p>
              </div>
            </div>
          </Card>

          <Card title="Recent Invoices">
            <DataTable
              columns={[
                { key: 'id', title: 'Invoice ID', sortable: true },
                { key: 'date', title: 'Date', sortable: true },
                { key: 'amount', title: 'Amount', sortable: true, render: (value: number) => `$${value.toFixed(2)}` },
                { key: 'status', title: 'Status', sortable: true },
                { key: 'dueDate', title: 'Due Date', sortable: true },
              ]}
              data={invoices}
              onRowClick={(invoice) => console.log('Invoice clicked:', invoice)}
            />
          </Card>

          <Card title="Billing Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Plan</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">Premium Plan</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Billing Date</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">2024-01-01</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Billing Cycle</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">Monthly</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">$299.00</p>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'documents',
      label: 'Documents',
      content: (
        <div className="space-y-6">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Contract.pdf</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">2.4 MB</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Proposal.pdf</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">1.8 MB</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">SLA.pdf</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">3.2 MB</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Portal</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account, orders, and support tickets
            </p>
          </div>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {customer.name.charAt(0)}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{customer.name}</span>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex flex-wrap gap-4">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </Button>
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </Card>

      <Tabs tabs={tabs} defaultActiveTab="profile" />
    </div>
  );
};

export default CustomerPortal;