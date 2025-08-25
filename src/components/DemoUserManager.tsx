import React, { useState } from 'react';
import { Users, Plus, Trash2, Search } from 'lucide-react';
import { createDemoUsers, checkDemoUsers, deleteDemoUsers } from '../utils/createDemoUsers';

const DemoUserManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateUsers = async () => {
    setLoading(true);
    setMessage('Creating demo users...');
    
    try {
      await createDemoUsers();
      setMessage('✅ Demo users created successfully!');
    } catch (error) {
      setMessage(`❌ Error creating users: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckUsers = async () => {
    setLoading(true);
    setMessage('Checking demo users...');
    
    try {
      await checkDemoUsers();
      setMessage('✅ Check completed - see console for details');
    } catch (error) {
      setMessage(`❌ Error checking users: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUsers = async () => {
    if (!confirm('Are you sure you want to delete demo users?')) return;
    
    setLoading(true);
    setMessage('Deleting demo users...');
    
    try {
      await deleteDemoUsers();
      setMessage('✅ Demo users deleted successfully!');
    } catch (error) {
      setMessage(`❌ Error deleting users: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center mb-4">
        <Users className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Demo User Manager</h3>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={handleCreateUsers}
            disabled={loading}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Demo Users
          </button>
          
          <button
            onClick={handleCheckUsers}
            disabled={loading}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Search className="w-4 h-4 mr-2" />
            Check Users
          </button>
          
          <button
            onClick={handleDeleteUsers}
            disabled={loading}
            className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Demo Users
          </button>
        </div>
        
        {message && (
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
          </div>
        )}
        
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p><strong>Demo Credentials:</strong></p>
          <p>• admin@skymed.com / admin123 (Administrator)</p>
          <p>• doctor@skymed.com / doctor123 (Doctor)</p>
          <p>• nurse@skymed.com / nurse123 (Nurse)</p>
        </div>
      </div>
    </div>
  );
};

export default DemoUserManager;