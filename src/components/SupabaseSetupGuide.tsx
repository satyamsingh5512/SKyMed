import { ExternalLink, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function SupabaseSetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const envExample = `# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          🚀 Supabase Setup Guide
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Follow these steps to connect your database
        </p>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Step 1 */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            1
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white">Create Supabase Project</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Go to Supabase and create a new project
            </p>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-blue-500 hover:text-blue-600 text-sm mt-2"
            >
              <span>Open Supabase Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            2
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white">Get API Credentials</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              In your project: Settings → API → Copy URL and anon key
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            3
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white">Update .env File</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Replace the placeholder values in your .env file:
            </p>
            <div className="mt-2 relative">
              <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs overflow-x-auto">
                <code>{envExample}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(envExample, 3)}
                className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {copiedStep === 3 ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            4
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white">Run Database Schema</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              In Supabase: SQL Editor → New Query → Paste schema → Run
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Use the supabase-schema.sql file from your project root
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            5
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white">Restart Development Server</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Stop and restart your dev server to load new environment variables
            </p>
            <div className="mt-2 bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs">
              <code>npm run dev</code>
            </div>
          </div>
        </div>

        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Need help?</strong> Check the SUPABASE_SETUP.md file in your project root for detailed instructions.
          </p>
        </div>
      </div>
    </div>
  )
}