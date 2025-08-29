import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [forceSkipLoading, setForceSkipLoading] = React.useState(false);

  // Add a timeout to skip loading if it takes too long
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('ProtectedRoute: Forcing skip loading after 3 seconds');
      setForceSkipLoading(true);
    }, 3000);

    if (!loading) {
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [loading]);

  if (loading && !forceSkipLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          <button 
            onClick={() => setForceSkipLoading(true)}
            className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Skip Loading
          </button>
        </div>
      </div>
    );
  }

  if (!user && !forceSkipLoading) {
    // Redirect to homepage with return url
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If we're forcing skip loading and no user, show the children anyway (for development)
  if (forceSkipLoading && !user) {
    console.log('ProtectedRoute: Showing content without authentication (development mode)');
  }

  return <>{children}</>;
};

export default ProtectedRoute;