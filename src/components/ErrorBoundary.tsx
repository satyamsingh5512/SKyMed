import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 dark:bg-gray-800">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The application encountered an unexpected error. This might be due to a database connection issue or a code problem.
              </p>
              
              {this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left dark:bg-red-900 dark:border-red-800">
                  <h3 className="font-medium text-red-900 dark:text-red-100 mb-2">Error Details:</h3>
                  <p className="text-sm text-red-700 dark:text-red-200 font-mono">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </button>
                
                <Link
                  to="/"
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Homepage
                </Link>
              </div>
              
              <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                <p>If this problem persists, please check:</p>
                <ul className="mt-2 space-y-1 text-left">
                  <li>• Database connection in Supabase</li>
                  <li>• Environment variables are set correctly</li>
                  <li>• Database schema is properly installed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;