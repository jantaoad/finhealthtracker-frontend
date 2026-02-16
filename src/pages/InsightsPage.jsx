import React from 'react'
import { insightService } from '../services/api'
import { Lightbulb, AlertTriangle, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react'

export default function InsightsPage() {
  const [insights, setInsights] = React.useState([])
  const [predictions, setPredictions] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [insRes, predRes] = await Promise.all([
        insightService.getInsights(),
        insightService.getPredictions()
      ])
      setInsights(Array.isArray(insRes.data) ? insRes.data : [])
      setPredictions(Array.isArray(predRes.data) ? predRes.data : [])
    } catch (error) {
      console.error('Failed to load insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const getInsightIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-6 h-6" />
      case 'tip':
        return <Lightbulb className="w-6 h-6" />
      case 'achievement':
        return <CheckCircle className="w-6 h-6" />
      case 'goal':
        return <TrendingUp className="w-6 h-6" />
      default:
        return <Lightbulb className="w-6 h-6" />
    }
  }

  const getInsightStyle = (type) => {
    switch (type) {
      case 'warning':
        return {
          bg: 'from-yellow-500 to-yellow-600',
          light: 'bg-yellow-50',
          text: 'text-yellow-900',
          icon: 'text-yellow-600'
        }
      case 'tip':
        return {
          bg: 'from-blue-500 to-blue-600',
          light: 'bg-blue-50',
          text: 'text-blue-900',
          icon: 'text-blue-600'
        }
      case 'achievement':
        return {
          bg: 'from-green-500 to-green-600',
          light: 'bg-green-50',
          text: 'text-green-900',
          icon: 'text-green-600'
        }
      case 'goal':
        return {
          bg: 'from-purple-500 to-purple-600',
          light: 'bg-purple-50',
          text: 'text-purple-900',
          icon: 'text-purple-600'
        }
      default:
        return {
          bg: 'from-gray-500 to-gray-600',
          light: 'bg-gray-50',
          text: 'text-gray-900',
          icon: 'text-gray-600'
        }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading insights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">💡 AI Insights</h1>
        <p className="text-blue-100">Personalized financial recommendations based on your spending patterns</p>
      </div>

      {/* Insights Section */}
      {insights.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Your Insights</h2>
          <div className="space-y-4">
            {insights.map((insight, idx) => {
              const style = getInsightStyle(insight.type)
              return (
                <div
                  key={idx}
                  className={`${style.light} rounded-2xl border-l-4 p-6 shadow-lg hover:shadow-xl transition-shadow`}
                  style={{ borderLeftColor: `rgb(var(--color-${insight.type}))` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full ${style.light} flex items-center justify-center flex-shrink-0 ${style.icon}`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{insight.title}</h3>
                          <p className={`${style.text} mt-2 leading-relaxed`}>{insight.description}</p>
                        </div>
                        <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap capitalize ${style.light} ${style.text}`}>
                          {insight.priority}
                        </span>
                      </div>
                      {insight.actionable && (
                        <button className={`mt-4 flex items-center gap-2 font-semibold ${style.icon} hover:opacity-80 transition-opacity`}>
                          Take Action
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Predictions Section */}
      {predictions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Spending Predictions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions.slice(0, 6).map((pred, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 capitalize">{pred.category}</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {pred.category?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 uppercase tracking-wide">Predicted Amount</p>
                    <p className="text-2xl font-bold text-gray-900">${parseFloat(pred.predictedAmount).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 uppercase">Confidence</p>
                      <p className="text-sm font-semibold text-blue-600">{Math.round(parseFloat(pred.confidence) * 100)}%</p>
                    </div>
                    <div className="w-full ml-4 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                        style={{ width: `${Math.min(parseFloat(pred.confidence) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {insights.length === 0 && predictions.length === 0 && (
        <div className="text-center py-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-200">
          <Lightbulb className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-900 mb-2">No insights available yet</p>
          <p className="text-gray-600 mb-6">Start tracking your transactions to get personalized AI-powered financial recommendations</p>
          <a
            href="/transactions"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Add Your First Transaction
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      )}
    </div>
  )
}
