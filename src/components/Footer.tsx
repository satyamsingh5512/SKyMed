import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-red-500 fill-current" />
          <span>by</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">Team Helidx</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;