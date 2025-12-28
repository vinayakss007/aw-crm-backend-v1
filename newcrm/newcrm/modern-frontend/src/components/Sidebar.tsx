import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  UserIcon, 
  BriefcaseIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  CogIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline';
import { User } from '../types';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, user }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Leads', href: '/leads', icon: UserGroupIcon },
    { name: 'Accounts', href: '/accounts', icon: BriefcaseIcon },
    { name: 'Contacts', href: '/contacts', icon: UserIcon },
    { name: 'Opportunities', href: '/opportunities', icon: BriefcaseIcon },
    { name: 'Activities', href: '/activities', icon: CalendarIcon },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  ];

  const adminNavigation = [
    { name: 'Admin', href: '/admin', icon: UserCircleIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-indigo-700 transition duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-center h-16 px-4 bg-indigo-800">
        <h1 className="text-white text-xl font-bold">ABETWORKS CRM</h1>
      </div>
      <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                isActive(item.href)
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-100 hover:bg-indigo-600'
              } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200`}
            >
              <item.icon
                className={`${
                  isActive(item.href) ? 'text-white' : 'text-indigo-300'
                } mr-4 h-6 w-6`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
          
          {(user?.role === 'admin' || user?.role === 'super_admin') && (
            <>
              <div className="mt-8 pt-8 border-t border-indigo-600">
                <h3 className="px-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">Admin</h3>
                {adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'bg-indigo-800 text-white'
                        : 'text-indigo-100 hover:bg-indigo-600'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200 mt-1`}
                  >
                    <item.icon
                      className={`${
                        isActive(item.href) ? 'text-white' : 'text-indigo-300'
                      } mr-4 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </div>
            </>
          )}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
        <div className="flex items-center">
          <div>
            <div className="text-base font-medium text-white">{user?.firstName} {user?.lastName}</div>
            <div className="text-sm font-medium text-indigo-200">{user?.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;