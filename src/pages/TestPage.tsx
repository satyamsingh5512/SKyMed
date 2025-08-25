import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          🧪 Test Page - App is Working!
        </h1>
        
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <strong>Success!</strong> If you can see this page, React is working properly.
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-900 mb-2">Environment Check</h2>
            <ul className="space-y-1 text-blue-800">
              <li>✅ React is rendering</li>
              <li>✅ Tailwind CSS is working</li>
              <li>✅ TypeScript is compiling</li>
              <li>✅ Theme context is functional</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-yellow-900 mb-2">Next Steps</h2>
            <ol className="list-decimal list-inside space-y-1 text-yellow-800">
              <li>Check browser console for any errors</li>
              <li>Try navigating to other pages</li>
              <li>Test database connection</li>
            </ol>
          </div>

          <div className="flex space-x-4">
            <a 
              href="/" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Dashboard
            </a>
            <a 
              href="/database-test" 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Test Database
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;