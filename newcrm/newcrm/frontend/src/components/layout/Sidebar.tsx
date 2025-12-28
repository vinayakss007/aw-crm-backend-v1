import React, { useState, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Home, Users, Briefcase, Contact, Phone, Settings, User, FileText, BarChart3, Mail, Menu, X, Shield, Wrench, UserCircle } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Navigation items for all users
  const baseNavigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Leads', href: '/leads', icon: User },
    { name: 'Opportunities', href: '/opportunities', icon: Briefcase },
    { name: 'Contacts', href: '/contacts', icon: Contact },
    { name: 'Accounts', href: '/accounts', icon: Users },
    { name: 'Activities', href: '/activities', icon: Phone },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Messages', href: '/messages', icon: Mail },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  // Admin-specific navigation items
  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: Shield },
    { name: 'User Management', href: '/admin/user-management', icon: Users },
    { name: 'System Settings', href: '/admin/system-settings', icon: Wrench },
  ];

  // Customer portal navigation items
  const customerNavigation = [
    { name: 'My Portal', href: '/customer/portal', icon: UserCircle },
  ];

  // Determine navigation based on user role
  let navigation = [...baseNavigation];

  if (user?.role === 'admin') {
    navigation = [...baseNavigation, ...adminNavigation];
  } else if (user?.role === 'customer') {
    navigation = [...customerNavigation];
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="flex">
      {/* Collapsed sidebar for mobile */}
      <div className="md:hidden fixed inset-y-0 left-0 z-30 flex items-start justify-start pt-16 bg-gray-800 bg-opacity-75 w-full h-full"
           style={{ display: isCollapsed ? 'flex' : 'none' }}
           onClick={() => setIsCollapsed(false)}>
        <div className="bg-white dark:bg-gray-800 w-64 shadow-lg h-full" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">ABETWORKS CRM</h2>
            <button
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setIsCollapsed(false)}
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors mb-1`}
                  onClick={() => setIsCollapsed(false)}
                >
                  <Icon
                    className={`${
                      isActive(item.href) ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 h-5 w-5 flex-shrink-0`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`${isCollapsed ? 'w-20' : 'w-64'} hidden md:flex md:flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300`}>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between flex-shrink-0 px-4 h-16 border-b border-gray-200 dark:border-gray-700">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">ABETWORKS CRM</h2>
            )}
            <button
              className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <X size={24} />
            </button>
            <button
              className="hidden md:block text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors mb-1`}
                  >
                    <Icon
                      className={`${
                        isActive(item.href) ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                      } ${
                        isCollapsed ? 'mx-auto' : 'mr-3'
                      } h-5 w-5 flex-shrink-0`}
                      aria-hidden="true"
                    />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          {!isCollapsed && (
            <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-20">
        <button
          className="bg-white dark:bg-gray-800 rounded-md p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 shadow"
          onClick={() => setIsCollapsed(true)}
        >
          <Menu size={24} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;