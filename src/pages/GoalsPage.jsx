import React from 'react'
import { goalService } from '../services/api'
import { formatCurrency, formatDate } from '../utils/helpers'
import { Plus, Target, Edit2, Trash2, TrendingUp } from 'lucide-react'

export default function GoalsPage() {
  const [goals, setGoals] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [showModal, setShowModal] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    targetAmount: '',
    deadline: '',
    priority: 'medium'
  })

  React.useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    try {
      setLoading(true)
      const res = await goalService.getAll()
      setGoals(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error('Failed to load goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await goalService.create({
        ...formData,
        savedAmount: 0,
        status: 'active'
      })
      setFormData({ name: '', targetAmount: '', deadline: '', priority: 'medium' })
      setShowModal(false)
      loadGoals()
    } catch (error) {
      console.error('Failed to create goal:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading goals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">🎯 Savings Goals</h1>
        <p className="text-blue-100">Set and track your financial goals</p>
      </div>

      {/* Create Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
      >
        <Plus className="w-5 h-5" /> New Goal
      </button>

      {/* Goals List */}
      <div>
        {goals.length > 0 ? (
          <div className="space-y-6">
            {goals.map((goal) => {
              const progress = (parseFloat(goal.savedAmount) / parseFloat(goal.targetAmount)) * 100
              const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
              const isCompleted = goal.status === 'completed'

              return (
                <div
                  key={goal.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${
                        isCompleted 
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        <Target className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{goal.name}</h3>
                        <p className="text-gray-600 mt-1">Priority: <span className="font-semibold capitalize">{goal.priority || 'medium'}</span></p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                      isCompleted 
                        ? 'bg-green-100 text-green-800'
                        : daysLeft < 0
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isCompleted ? '✅ Completed' : daysLeft < 0 ? '⏰ Overdue' : `${daysLeft} days`}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-4 mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-gray-600 text-sm">Saved</p>
                        <p className="text-lg font-bold text-gray-900">${parseFloat(goal.savedAmount).toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600 text-sm">Target</p>
                        <p className="text-lg font-bold text-gray-900">${parseFloat(goal.targetAmount).toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600 text-sm">Progress</p>
                        <p className="text-lg font-bold text-blue-600">{progress.toFixed(1)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600 text-sm">Left</p>
                        <p className="text-lg font-bold text-gray-900">${(parseFloat(goal.targetAmount) - parseFloat(goal.savedAmount)).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Deadline Info */}
                  <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Deadline</p>
                        <p className="font-semibold text-gray-900">{formatDate(goal.deadline)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Monthly Target</p>
                        <p className="font-semibold text-gray-900">
                          ${daysLeft > 0 ? (parseFloat(goal.targetAmount) / (daysLeft / 30)).toFixed(2) : '0'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button className="flex-1 flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg font-medium transition-all">
                      <TrendingUp className="w-4 h-4" /> Add Progress
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg font-medium transition-all">
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg font-medium transition-all">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-200">
            <Target className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-900 mb-2">No savings goals yet</p>
            <p className="text-gray-600 mb-6">Create your first goal to start planning</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Set Your First Goal
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Goal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Goal Name (e.g., Vacation)"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
              <input
                type="number"
                placeholder="Target Amount"
                value={formData.targetAmount}
                onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Create Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
