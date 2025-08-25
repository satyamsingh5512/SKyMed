import React, { useState, useEffect } from 'react';
import { Package, Clock, MapPin, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Delivery } from '../lib/supabase';

const OrderHistory: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('You must be logged in to view order history');
      }

      // Fetch deliveries for the current user
      const { data, error: fetchError } = await supabase
        .from('deliveries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setDeliveries(data || []);
    } catch (err) {
      console.error('Failed to fetch deliveries:', err);
      setError(err instanceof Error ? err.message : 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'in_transit':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Order History
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View all your previous parcel deliveries and their status
            </p>
          </div>
          <button
            onClick={fetchDeliveries}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading your orders...
          </h3>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to load orders
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
          <button
            onClick={fetchDeliveries}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : deliveries.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your order history will appear here once you send your first parcel.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(delivery.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {delivery.package_type}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Order #SP-{delivery.id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    delivery.status
                  )}`}
                >
                  {delivery.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      From
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {delivery.pickup_address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      To
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {delivery.delivery_address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Created
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(delivery.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Recipient
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {delivery.recipient_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {delivery.recipient_phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Weight & Cost
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {delivery.weight}kg • ₹{delivery.cost.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {delivery.priority === 'emergency' && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">
                    Emergency Priority
                  </span>
                </div>
              )}

              {delivery.estimated_delivery && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Estimated Delivery: {formatDate(delivery.estimated_delivery)}
                  </p>
                  {delivery.actual_delivery && (
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Delivered: {formatDate(delivery.actual_delivery)}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;