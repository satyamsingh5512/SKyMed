import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Bell, Sun, Moon, LogOut, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import SkyMedLogo from './SkyMedLogo';
import LogoutConfirmDialog from './LogoutConfirmDialog';

const UserHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogoutClick = () => {
    setIsUserMenuOpen(false);
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      setIsSigningOut(true);
      console.log('Initiating logout...');
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      setIsSigningOut(false);
      // Force redirect even on error
      window.location.href = '/';
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
    setIsSigningOut(false);
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Send Parcel', href: '/send', icon: '📦' },
    { name: 'Track Parcel', href: '/track', icon: '📍' },
    { name: 'Order History', href: '/history', icon: '📋' },
    { name: 'Live Map', href: '/maps', icon: '🗺️' },
    { name: 'Profile', href: '/profile', icon: '👤' },
    { name: 'DB Test', href: '/database-test', icon: '🔍' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <SkyMedLogo size="sm" />
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">SkyMed</h1>
              <p className="text-xs text-gray-600 dark:text-gray-300">Emergency Medical Drone Network</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium hidden lg:block">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </span>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              
              {/* Mobile Theme Toggle */}
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full text-left text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-5 h-5" />
                    <span className="font-medium">Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-5 h-5" />
                    <span className="font-medium">Light Mode</span>
                  </>
                )}
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        isOpen={showLogoutDialog}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isLoading={isSigningOut}
      />
    </header>
  );
};

export default UserHeader;