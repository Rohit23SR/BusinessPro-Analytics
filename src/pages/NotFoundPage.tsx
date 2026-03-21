// 404 Not Found page
import { ArrowLeft, Home, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="mb-4 text-8xl font-bold text-indigo-600">404</div>
          <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-indigo-100">
            <Search className="h-16 w-16 text-indigo-600" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-gray-600">
            Sorry, we couldn't find the page you're looking for. The page might have been moved,
            deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-white transition-colors hover:bg-indigo-700"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="mb-4 text-sm text-gray-500">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/dashboard/analytics')}
              className="text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Analytics
            </button>
            <button
              onClick={() => navigate('/dashboard/revenue')}
              className="text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Revenue
            </button>
            <button
              onClick={() => navigate('/dashboard/settings')}
              className="text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
