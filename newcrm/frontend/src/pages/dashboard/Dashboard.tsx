import React from 'react';
import { useGetCurrentUserQuery } from '../services/apiSlice';
import Card from '../components/common/Card';
import { User, Briefcase, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data: user, isLoading, error } = useGetCurrentUserQuery();

  // Mock data for dashboard stats
  const stats = [
    { name: 'Total Users', value: '1,248', change: '+5.2%', icon: User, color: 'bg-blue-500' },
    { name: 'Active Leads', value: '342', change: '+12.4%', icon: Briefcase, color: 'bg-green-500' },
    { name: 'Deals Value', value: '$2.4M', change: '+8.7%', icon: DollarSign, color: 'bg-yellow-500' },
    { name: 'Conversion Rate', value: '24.5%', change: '+3.1%', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {user?.user.firstName} {user?.user.lastName}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="overflow-hidden">
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
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activity">
          <div className="flow-root">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                      JS
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      John Smith
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      updated lead "ABC Corp"
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">2 min ago</p>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                      JD
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      Jane Doe
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      created deal "XYZ Project"
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">15 min ago</p>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">
                      MJ
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      Mike Johnson
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      converted lead "DEF Inc"
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">1 hour ago</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 text-blue-700 dark:text-blue-300 font-medium py-3 px-4 rounded-md text-center transition-colors">
              Add Lead
            </button>
            <button className="bg-green-50 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-gray-600 text-green-700 dark:text-green-300 font-medium py-3 px-4 rounded-md text-center transition-colors">
              Create Deal
            </button>
            <button className="bg-yellow-50 dark:bg-gray-700 hover:bg-yellow-100 dark:hover:bg-gray-600 text-yellow-700 dark:text-yellow-300 font-medium py-3 px-4 rounded-md text-center transition-colors">
              Schedule Meeting
            </button>
            <button className="bg-purple-50 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-gray-600 text-purple-700 dark:text-purple-300 font-medium py-3 px-4 rounded-md text-center transition-colors">
              Import Data
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;