import React, { useState } from 'react';
import { useGetCurrentUserQuery, useGetLeadsQuery, useGetOpportunitiesQuery } from '../services/apiSlice';
import Card from '../components/common/Card';
import DashboardWidget from '../components/common/DashboardWidget';
import ActivityTimeline from '../components/common/ActivityTimeline';
import Button from '../components/common/Button';
import { User, Briefcase, DollarSign, TrendingUp, Calendar, Clock, Phone, Mail, Plus, Grid3X3, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data: user, isLoading: userLoading, error: userError } = useGetCurrentUserQuery();
  const { data: leads, isLoading: leadsLoading } = useGetLeadsQuery({ page: 1, limit: 5 });
  const { data: opportunities, isLoading: opportunitiesLoading } = useGetOpportunitiesQuery();

  // Mock data for dashboard stats
  const stats = [
    { name: 'Total Users', value: '1,248', change: '+5.2%', icon: User, color: 'bg-blue-500' },
    { name: 'Active Leads', value: '342', change: '+12.4%', icon: Briefcase, color: 'bg-green-500' },
    { name: 'Deals Value', value: '$2.4M', change: '+8.7%', icon: DollarSign, color: 'bg-yellow-500' },
    { name: 'Conversion Rate', value: '24.5%', change: '+3.1%', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  // Mock recent activities
  const recentActivities = [
    {
      id: '1',
      type: 'call',
      title: 'Call with ABC Corp',
      description: 'Discussed new contract terms',
      timestamp: '2 minutes ago',
      user: 'John Smith'
    },
    {
      id: '2',
      type: 'email',
      title: 'Email to XYZ Ltd',
      description: 'Sent proposal document',
      timestamp: '15 minutes ago',
      user: 'Jane Doe'
    },
    {
      id: '3',
      type: 'meeting',
      title: 'Team meeting',
      description: 'Weekly sales review',
      timestamp: '1 hour ago',
      user: 'Mike Johnson'
    },
    {
      id: '4',
      type: 'task',
      title: 'Follow up with client',
      description: 'Schedule follow-up call',
      timestamp: '2 hours ago',
      user: 'Sarah Williams'
    }
  ];

  // Mock upcoming events
  const upcomingEvents = [
    { id: '1', title: 'Client Meeting', time: '10:00 AM', date: 'Today' },
    { id: '2', title: 'Team Sync', time: '2:00 PM', date: 'Today' },
    { id: '3', title: 'Product Demo', time: '11:00 AM', date: 'Tomorrow' },
  ];

  if (userLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="p-6">
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">Error loading dashboard data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {user?.user.firstName} {user?.user.lastName}!
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            Add Activity
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <DashboardWidget key={index} className="overflow-hidden">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  <Icon size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-green-500">{stat.change}</p>
                </div>
              </div>
            </DashboardWidget>
          );
        })}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <div className="lg:col-span-2">
          <DashboardWidget
            title="Recent Activity"
            actions={
              <Button variant="outline" size="sm">
                <Activity className="h-4 w-4 mr-1" />
                View All
              </Button>
            }
          >
            <ActivityTimeline activities={recentActivities} />
          </DashboardWidget>
        </div>

        {/* Upcoming Events */}
        <DashboardWidget
          title="Upcoming Events"
          actions={
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-1" />
              Calendar
            </Button>
          }
        >
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {upcomingEvents.map((event) => (
              <li key={event.id} className="py-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{event.time}</span>
                      <span className="mx-2">•</span>
                      <span>{event.date}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </DashboardWidget>

        {/* Quick Actions */}
        <DashboardWidget title="Quick Actions">
          <div className="grid grid-cols-2 gap-4">
            <Button className="flex flex-col items-center justify-center py-4">
              <Briefcase className="h-6 w-6 mb-2" />
              <span>Add Lead</span>
            </Button>
            <Button className="flex flex-col items-center justify-center py-4">
              <DollarSign className="h-6 w-6 mb-2" />
              <span>Create Deal</span>
            </Button>
            <Button className="flex flex-col items-center justify-center py-4">
              <Phone className="h-6 w-6 mb-2" />
              <span>Schedule Call</span>
            </Button>
            <Button className="flex flex-col items-center justify-center py-4">
              <Mail className="h-6 w-6 mb-2" />
              <span>Send Email</span>
            </Button>
          </div>
        </DashboardWidget>

        {/* Performance Metrics */}
        <DashboardWidget title="Performance Metrics">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Sales Target</span>
                <span className="font-medium">75%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Conversion Rate</span>
                <span className="font-medium">24.5%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '24.5%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                <span className="font-medium">2.3h</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </DashboardWidget>
      </div>
    </div>
  );
};

export default Dashboard;