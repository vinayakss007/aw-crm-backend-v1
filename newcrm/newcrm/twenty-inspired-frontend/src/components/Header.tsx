import { Bars3Icon, BellIcon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-20 flex items-center justify-between h-16 px-4 bg-white dark:bg-slate-800 shadow-sm transition-all duration-300 ${sidebarOpen ? 'lg:left-64' : ''}`}>
      <div className="flex items-center">
        <button
          type="button"
          className="mr-3 text-gray-500 dark:text-gray-300 rounded-md lg:hidden hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span className="sr-only">Open sidebar</span>
          {sidebarOpen ? (
            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="w-6 h-6" aria-hidden="true" />
          )}
        </button>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">CRM Dashboard</h2>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-1 text-gray-500 dark:text-gray-300 rounded-full hover:text-gray-700 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {theme === 'dark' ? (
            <SunIcon className="w-6 h-6" aria-hidden="true" />
          ) : (
            <MoonIcon className="w-6 h-6" aria-hidden="true" />
          )}
        </button>
        <button className="p-1 text-gray-500 dark:text-gray-300 rounded-full hover:text-gray-700 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <BellIcon className="w-6 h-6" aria-hidden="true" />
        </button>
        <div className="relative" ref={dropdownRef}>
          <div
            className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-indigo-300"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">AU</span>
          </div>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-slate-700">
              <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700">Your Profile</a>
              <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700">Settings</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700">Sign out</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;