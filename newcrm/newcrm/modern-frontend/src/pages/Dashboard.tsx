import React, { useState } from 'react';
import {
  UserGroupIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  UserIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data for dashboard
  const stats = [
    { name: 'Total Leads', value: '24', change: '+4.75%', changeType: 'positive', icon: UserGroupIcon, color: 'bg-blue-500', trend: 'up' },
    { name: 'Total Accounts', value: '12', change: '+5.33%', changeType: 'positive', icon: BriefcaseIcon, color: 'bg-green-500', trend: 'up' },
    { name: 'Total Opportunities', value: '8', change: '+18.12%', changeType: 'positive', icon: CurrencyDollarIcon, color: 'bg-yellow-500', trend: 'up' },
    { name: 'Total Activities', value: '32', change: '+12.49%', changeType: 'positive', icon: ChatBubbleLeftRightIcon, color: 'bg-purple-500', trend: 'up' },
  ];

  const leadData = [
    { name: 'Jan', leads: 400, opportunities: 240, closed: 24 },
    { name: 'Feb', leads: 300, opportunities: 138, closed: 18 },
    { name: 'Mar', leads: 200, opportunities: 98, closed: 12 },
    { name: 'Apr', leads: 278, opportunities: 120, closed: 16 },
    { name: 'May', leads: 189, opportunities: 80, closed: 10 },
    { name: 'Jun', leads: 239, opportunities: 100, closed: 14 },
  ];

  const opportunityData = [
    { name: 'New', value: 400, color: '#3b82f6' },
    { name: 'Qualified', value: 300, color: '#10b981' },
    { name: 'Proposal', value: 300, color: '#f59e0b' },
    { name: 'Negotiation', value: 200, color: '#8b5cf6' },
    { name: 'Closed Won', value: 150, color: '#22c55e' },
    { name: 'Closed Lost', value: 80, color: '#ef4444' },
  ];

  const recentLeads = [
    { id: 1, name: 'Acme Corporation', email: 'contact@acme.com', status: 'new', owner: 'John Doe', created: '2 hours ago', value: '$25,000' },
    { id: 2, name: 'Tech Solutions Inc', email: 'info@techsolutions.com', status: 'contacted', owner: 'Jane Smith', created: '4 hours ago', value: '$42,000' },
    { id: 3, name: 'Global Enterprises', email: 'hello@globalent.com', status: 'qualified', owner: 'Mike Roberts', created: '6 hours ago', value: '$65,000' },
    { id: 4, name: 'Innovate Co', email: 'support@innovateco.com', status: 'new', owner: 'Sarah Johnson', created: '1 day ago', value: '$32,000' },
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'created', entity: 'lead', name: 'Acme Corp', time: '2 hours ago', type: 'lead' },
    { id: 2, user: 'Jane Smith', action: 'updated', entity: 'opportunity', name: 'Enterprise Deal', time: '4 hours ago', type: 'opportunity' },
    { id: 3, user: 'Mike Roberts', action: 'completed', entity: 'call', name: 'Follow-up with Client', time: '6 hours ago', type: 'call' },
    { id: 4, user: 'Sarah Johnson', action: 'sent', entity: 'email', name: 'Project Proposal', time: '1 day ago', type: 'email' },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Follow up with Acme Corp', due: 'Today', priority: 'high', assignee: 'John Doe', completed: false },
    { id: 2, title: 'Prepare proposal for Tech Solutions', due: 'Tomorrow', priority: 'medium', assignee: 'Jane Smith', completed: false },
    { id: 3, title: 'Schedule demo with Global Enterprises', due: 'In 2 days', priority: 'high', assignee: 'Mike Roberts', completed: true },
    { id: 4, title: 'Send contract to Innovate Co', due: 'Next week', priority: 'low', assignee: 'Sarah Johnson', completed: false },
  ];

  const topPerformers = [
    { id: 1, name: 'John Doe', deals: 5, value: '$125,000', conversion: '85%' },
    { id: 2, name: 'Jane Smith', deals: 4, value: '$98,000', conversion: '78%' },
    { id: 3, name: 'Mike Roberts', deals: 3, value: '$75,000', conversion: '72%' },
    { id: 4, name: 'Sarah Johnson', deals: 2, value: '$52,000', conversion: '65%' },
  ];

  const salesData = [
    { name: 'Jan', revenue: 4000, profit: 2400 },
    { name: 'Feb', revenue: 3000, profit: 1398 },
    { name: 'Mar', revenue: 2000, profit: 9800 },
    { name: 'Apr', revenue: 2780, profit: 3908 },
    { name: 'May', revenue: 1890, profit: 4800 },
    { name: 'Jun', revenue: 2390, profit: 3800 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search..."
                />
              </div>
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <Cog6ToothIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                    <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change}
                          {stat.trend === 'up' ? (
                            <ArrowUpIcon className="ml-1 h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownIcon className="ml-1 h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Performance */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white p-6 shadow rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Sales Performance</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTimeRange('7d')}
                  className={`px-3 py-1 text-sm rounded-md ${timeRange === '7d' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  7D
                </button>
                <button
                  onClick={() => setTimeRange('30d')}
                  className={`px-3 py-1 text-sm rounded-md ${timeRange === '30d' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  30D
                </button>
                <button
                  onClick={() => setTimeRange('90d')}
                  className={`px-3 py-1 text-sm rounded-md ${timeRange === '90d' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  90D
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" activeDot={{ r: 8 }} name="Revenue" />
                  <Line type="monotone" dataKey="profit" stroke="#10b981" name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Opportunity Stages */}
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Opportunity Pipeline</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={opportunityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {opportunityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity and Tasks */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Leads */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Leads</h3>
              <p className="mt-1 text-sm text-gray-500">Newly created leads in your organization</p>
            </div>
            <ul className="divide-y divide-gray-200">
              {recentLeads.map((lead) => (
                <li key={lead.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-indigo-600 truncate">{lead.name}</div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <div className="mr-6 flex items-center text-sm text-gray-500">
                        <EnvelopeIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                        <span>{lead.email}</span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <CurrencyDollarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                        <span>{lead.value}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <span>{lead.owner}</span>
                      <span className="mx-2">•</span>
                      <span>{lead.created}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
              <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                View all
              </button>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Upcoming Tasks</h3>
              <p className="mt-1 text-sm text-gray-500">Tasks assigned to you</p>
            </div>
            <ul className="divide-y divide-gray-200">
              {upcomingTasks.map((task) => (
                <li key={task.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className={`text-sm font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{task.title}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                          <span>{task.due}</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
              <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                View all tasks
              </button>
            </div>
          </div>
        </div>

        {/* Top Performers and Recent Activities */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top Performers */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Top Performers</h3>
              <p className="mt-1 text-sm text-gray-500">Sales team performance this month</p>
            </div>
            <ul className="divide-y divide-gray-200">
              {topPerformers.map((performer) => (
                <li key={performer.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-800 font-medium">{performer.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div className="ml-4 min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{performer.name}</p>
                      <p className="text-sm text-gray-500 truncate">Deals: {performer.deals} | Value: {performer.value}</p>
                    </div>
                    <div className="ml-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {performer.conversion} conversion
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
              <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                View all performers
              </button>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activities</h3>
              <p className="mt-1 text-sm text-gray-500">Latest activities in your CRM</p>
            </div>
            <ul className="divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-800 font-medium">{activity.user.charAt(0)}</span>
                      </div>
                    </div>
                    <div className="ml-4 min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.user} <span className="font-normal text-gray-500"> {activity.action} {activity.entity} </span> {activity.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{activity.time}</p>
                    </div>
                    <div className="ml-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.type === 'lead' ? 'bg-blue-100 text-blue-800' :
                        activity.type === 'opportunity' ? 'bg-green-100 text-green-800' :
                        activity.type === 'call' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {activity.type}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
              <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                View all activities
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Quick Actions</h3>
            <p className="mt-1 text-sm text-gray-500">Perform common tasks quickly</p>
          </div>
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <button className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition-shadow">
              <UserGroupIcon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
              <span className="mt-2 text-sm font-medium text-gray-900">Add Lead</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition-shadow">
              <BriefcaseIcon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
              <span className="mt-2 text-sm font-medium text-gray-900">Add Account</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition-shadow">
              <CurrencyDollarIcon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
              <span className="mt-2 text-sm font-medium text-gray-900">Create Opportunity</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition-shadow">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
              <span className="mt-2 text-sm font-medium text-gray-900">Log Activity</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;