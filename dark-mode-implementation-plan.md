# Dark Mode Implementation Plan

## Overview
This document outlines the steps required to implement a dark mode toggle feature in the SkyMed application. The feature will allow users to switch between light and dark themes with dark mode as the default.

## Implementation Steps

### 1. Create ThemeContext
Create a new context file `src/contexts/ThemeContext.tsx` to manage the theme state:

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Check for saved theme preference or respect system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (systemPrefersDark) {
      setTheme('dark');
    } else {
      setTheme('dark'); // Default to dark as per user preference
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save theme preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### 2. Update Tailwind Configuration
Modify `tailwind.config.js` to enable dark mode with the class strategy:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 3. Update App.tsx
Wrap the application with the ThemeProvider:

```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserHeader from './components/UserHeader';
import SendParcel from './pages/SendParcel';
import TrackParcel from './pages/TrackParcel';
import UserDashboard from './pages/UserDashboard';
import Profile from './pages/Profile';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
            <UserHeader />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<UserDashboard />} />
                <Route path="/send" element={<SendParcel />} />
                <Route path="/track" element={<TrackParcel />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
```

### 4. Update UserHeader Component
Add the theme toggle button to the UserHeader component:

```typescript
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Menu, X, User, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const UserHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Send Parcel', href: '/send', icon: '📦' },
    { name: 'Track Parcel', href: '/track', icon: '📍' },
    { name: 'Profile', href: '/profile', icon: '👤' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">SkyMed</h1>
              <p className="text-xs text-gray-600 dark:text-gray-300">Emergency Delivery</p>
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
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
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
    </header>
  );
};

export default UserHeader;
```

## Additional Components to Update

### Update Main Layout
The main layout in App.tsx already includes dark mode classes, but we should ensure all pages and components have appropriate dark mode styling.

### Example Component Updates
Here's an example of how to update other components with dark mode support:

```html
<!-- Example of applying dark mode classes -->
<div className="bg-white dark:bg-gray-800">
  <h2 className="text-gray-900 dark:text-white">Title</h2>
  <p className="text-gray-600 dark:text-gray-300">Content</p>
</div>
```

## Testing
1. Verify that the theme toggle button appears in the header
2. Test switching between light and dark modes
3. Confirm that the theme preference is saved in localStorage
4. Verify that the theme persists across page reloads
5. Test both desktop and mobile views
6. Check that all components display correctly in both themes

## Dependencies
No additional dependencies are required as we're using the existing lucide-react library for icons.