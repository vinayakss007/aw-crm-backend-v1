import React from 'react';
import { useGetCurrentUserQuery, useGetUsersQuery } from '../services/apiSlice';
import DashboardWidget from '../components/common/DashboardWidget';
import Button from '../components/common/Button';
import { 
  User, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Activity, 
  Users, 
  Database, 
  Shield, 
  Settings, 
  Eye,
  Plus,
  BarChart3,
  FileText,
  Clock
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();
  const { data: usersResponse, isLoading: usersLoading } = useGetUsersQuery({ page: 1, limit: 10 });

  // Mock data for admin dashboard
  const stats = [
    { name: 'Total Users', value: '1,248', change: '+5.2%', icon: User, color: 'bg-blue-500' },
    { name: 'Active Leads', value: '342', change: '+12.4%', icon: Briefcase, color: 'bg-green-500' },
    { name: 'Deals Value', value: '$2.4M', change: '+8.7%', icon: DollarSign, color: 'bg-yellow-500' },
    { name: 'Conversion Rate', value: '24.5%', change: '+3.1%', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  const systemStats = [
    { name: 'System Uptime', value: '99.9%', icon: Activity, color: 'bg-green-500' },
    { name: 'Database Size', value: '2.4 GB', icon: Database, color: 'bg-blue-500' },
    { name: 'API Requests', value: '12,480', icon: BarChart3, color: 'bg-purple-500' },
    { name: 'Active Sessions', value: '42', icon: Users, color: 'bg-yellow-500' },
  ];

  // Mock recent activities
  const recentActivities = [
    { id: '1', user: 'John Smith', action: 'updated lead "ABC Corp"', time: '2 min ago' },
    { id: '2', user: 'Jane Doe', action: 'created deal "XYZ Project"', time: '15 min ago' },
    { id: '3', user: 'Mike Johnson', action: 'converted lead "DEF Inc"', time: '1 hour ago' },
    { id: '4', user: 'Sarah Williams', action: 'added note to contact "Tech Solutions"', time: '2 hours ago' },
  ];

  // Mock audit logs
  const auditLogs = [
    { id: '1', user: 'Admin User', action: 'User login', time: '5 min ago', severity: 'info' },
    { id: '2', user: 'John Smith', action: 'Failed login attempt', time: '12 min ago', severity: 'warning' },
    { id: '3', user: 'Jane Doe', action: 'Deleted contact', time: '1 hour ago', severity: 'info' },
    { id: '4', user: 'System', action: 'Database backup completed', time: '2 hours ago', severity: 'success' },
  ];

  if (userLoading || usersLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              System overview and administrative controls
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            Add User
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

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {systemStats.map((stat, index) => {
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
                </div>
              </div>
            </DashboardWidget>
          );
        })}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
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
            <div className="flow-root">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                          {activity.user.charAt(0)}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {activity.user}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {activity.action}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </DashboardWidget>
        </div>

        {/* Audit Logs */}
        <DashboardWidget 
          title="Security Audit" 
          actions={
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-1" />
              View Logs
            </Button>
          }
        >
          <div className="flow-root">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {auditLogs.map((log) => (
                <li key={log.id} className="py-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-white text-xs ${
                        log.severity === 'success' ? 'bg-green-500' :
                        log.severity === 'warning' ? 'bg-yellow-500' :
                        log.severity === 'error' ? 'bg-red-500' : 'bg-blue-500'
                      }`}>
                        {log.severity === 'success' ? '✓' : 
                         log.severity === 'warning' ? '!' : 
                         log.severity === 'error' ? '✕' : '•'}
                      </div>
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {log.user}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {log.action}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{log.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </DashboardWidget>

        {/* Quick Admin Actions */}
        <DashboardWidget title="Quick Actions">
          <div className="grid grid-cols-1 gap-3">
            <Button className="flex items-center justify-start py-3">
              <Settings className="h-5 w-5 mr-2" />
              <span>System Settings</span>
            </Button>
            <Button className="flex items-center justify-start py-3">
              <Users className="h-5 w-5 mr-2" />
              <span>User Management</span>
            </Button>
            <Button className="flex items-center justify-start py-3">
              <Database className="h-5 w-5 mr-2" />
              <span>Custom Fields</span>
            </Button>
            <Button className="flex items-center justify-start py-3">
              <Shield className="h-5 w-5 mr-2" />
              <span>Security Settings</span>
            </Button>
            <Button className="flex items-center justify-start py-3">
              <FileText className="h-5 w-5 mr-2" />
              <span>Backup & Recovery</span>
            </Button>
          </div>
        </DashboardWidget>

        {/* System Health */}
        <DashboardWidget title="System Health">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Database</span>
                <span className="font-medium">Healthy</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">API Service</span>
                <span className="font-medium">Healthy</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Cache</span>
                <span className="font-medium">Healthy</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Storage</span>
                <span className="font-medium">75% used</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </DashboardWidget>
      </div>
    </div>
  );
};

export default AdminDashboard;