import React from 'react'
import { budgetService } from '../services/api'
import { formatCurrency } from '../utils/helpers'
import { Plus, AlertCircle, Edit2, Trash2 } from 'lucide-react'

export default function BudgetsPage() {
  const [budgets, setBudgets] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [showModal, setShowModal] = React.useState(false)
  const [formData, setFormData] = React.useState({
    category: 'groceries',
    limit: ''
  })

  React.useEffect(() => {
    loadBudgets()
  }, [])

  const loadBudgets = async () => {
    try {
      setLoading(true)
      const res = await budgetService.getAll()
      setBudgets(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error('Failed to load budgets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await budgetService.create(formData)
      setFormData({ category: 'groceries', limit: '' })
      setShowModal(false)
      loadBudgets()
    } catch (error) {
      console.error('Failed to create budget:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading budgets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">💰 Budgets</h1>
        <p className="text-blue-100">Manage and track your monthly budgets</p>
      </div>

      {/* Create Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
      >
        <Plus className="w-5 h-5" /> Create Budget
      </button>

      {/* Budgets Grid */}
      <div>
        {budgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => {
              const limit = parseFloat(budget.limit) || 0
              const spent = parseFloat(budget.spent) || 0
              const percentage = limit > 0 ? (spent / limit) * 100 : 0
              const isExceeded = percentage > 100
              const isWarning = percentage > 80

              return (
                <div
                  key={budget.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 capitalize">
                        {budget.category}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">Monthly Budget</p>
                    </div>
                    {isExceeded && (
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3 mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          isExceeded ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        ${spent.toFixed(2)} of ${limit.toFixed(2)}
                      </span>
                      <span className={`text-sm font-bold ${
                        isExceeded ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>

                    {isExceeded && (
                      <p className="text-sm text-red-600 font-semibold">
                        ⚠️ Over budget by ${(spent - limit).toFixed(2)}
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4 p-3 rounded-xl" style={{
                    backgroundColor: isExceeded ? '#fee2e2' : isWarning ? '#fef3c7' : '#dcfce7'
                  }}>
                    <p style={{
                      color: isExceeded ? '#991b1b' : isWarning ? '#92400e' : '#166534'
                    }} className="text-sm font-semibold">
                      {isExceeded ? '❌ Exceeded' : isWarning ? '⚠️ Warning' : '✅ On Track'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button className="flex-1 flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg font-medium transition-all">
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
            <p className="text-lg font-semibold text-gray-900 mb-2">No budgets created yet</p>
            <p className="text-gray-600 mb-6">Start managing your expenses by creating your first budget</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Create Budget Now
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Budget</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option value="groceries">Groceries</option>
                <option value="dining">Dining</option>
                <option value="entertainment">Entertainment</option>
                <option value="transportation">Transportation</option>
                <option value="utilities">Utilities</option>
                <option value="healthcare">Healthcare</option>
              </select>
              <input
                type="number"
                placeholder="Budget Limit"
                value={formData.limit}
                onChange={(e) => setFormData({...formData, limit: e.target.value})}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Create
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
