import React from 'react'
import { useAuth } from '../context/AuthContext'
import { insightService } from '../services/api'
import Dashboard from '../components/Dashboard'
import { TrendingUp, Target, AlertCircle, Zap } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = React.useState(null)
  const [insights, setInsights] = React.useState([])
  const [predictions, setPredictions] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [dashRes, insRes, predRes] = await Promise.all([
        insightService.getDashboard(),
        insightService.getInsights(),
        insightService.getPredictions()
      ])
      setDashboardData(dashRes.data)
      setInsights(insRes.data)
      setPredictions(predRes.data)
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-blue-100">Here's your financial overview for this month</p>
      </div>

      <Dashboard data={dashboardData} />

      {/* Quick Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Spent"
            value={`$${dashboardData?.totalSpent || 0}`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Saved This Month"
            value={`$${dashboardData?.totalSaved || 0}`}
            icon={<Target className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Budget Alert"
            value={`${dashboardData?.budgetAlert || 0}%`}
            icon={<AlertCircle className="w-6 h-6" />}
            color="yellow"
          />
          <StatCard
            title="AI Insights"
            value={insights.length}
            icon={<Zap className="w-6 h-6" />}
            color="purple"
          />
        </div>
      </div>

      {/* Recent Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 AI-Generated Insights</h2>
          <div className="space-y-4">
            {insights.slice(0, 3).map((insight, idx) => (
              <div
                key={idx}
                className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-xl hover:shadow-md transition-shadow"
              >
                <p className="font-semibold text-blue-900">{insight.title}</p>
                <p className="text-sm text-blue-700 mt-2">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 text-blue-600 bg-blue-50',
    green: 'from-green-500 to-green-600 text-green-600 bg-green-50',
    yellow: 'from-yellow-500 to-yellow-600 text-yellow-600 bg-yellow-50',
    purple: 'from-purple-500 to-purple-600 text-purple-600 bg-purple-50'
  }

  const [gradientClass, textClass, bgClass] = colorClasses[color].split(' ')

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-4 text-white shadow-md`}>
        {icon}
      </div>
      <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      <div className="mt-4 h-1 w-12 bg-gradient-to-r from-gray-200 to-transparent rounded-full"></div>
    </div>
  )
}
