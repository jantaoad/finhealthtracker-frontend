import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white mb-4">404</h1>
          <p className="text-4xl font-bold text-white mb-2">Page Not Found</p>
          <p className="text-xl text-blue-100">Oops! The page you're looking for doesn't exist.</p>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md mx-auto border border-white/20">
          <p className="text-gray-600 mb-8">
            It seems you've navigated to a page that doesn't exist. Don't worry, let's get you back on track!
          </p>

          <div className="space-y-4">
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <Home className="w-5 h-5" />
              Go to Dashboard
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </div>

        <p className="text-white/60 text-sm mt-8">
          © 2026 FinHealthTracker. Smart Financial Management.
        </p>
      </div>
    </div>
  )
}
