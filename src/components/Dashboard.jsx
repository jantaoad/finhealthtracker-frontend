import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { formatCurrency } from '../utils/helpers'

export default function Dashboard({ data }) {
  if (!data) return null

  const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444']

  const chartData = data.spendingByCategory?.map(item => ({
    name: item.category,
    value: item.amount
  })) || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Spending Overview */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-6">Monthly Spending Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Financial Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-6">Financial Summary</h2>
        <div className="space-y-4">
          <SummaryItem
            label="Total Income"
            value={formatCurrency(data.totalIncome || 0)}
            color="green"
          />
          <SummaryItem
            label="Total Expenses"
            value={formatCurrency(data.totalExpenses || 0)}
            color="red"
          />
          <div className="border-t pt-4">
            <SummaryItem
              label="Net Balance"
              value={formatCurrency((data.totalIncome || 0) - (data.totalExpenses || 0))}
              color="blue"
              highlight
            />
          </div>
          <SummaryItem
            label="Savings Rate"
            value={`${data.savingsRate || 0}%`}
            color="purple"
          />
        </div>
      </div>
    </div>
  )
}

function SummaryItem({ label, value, color, highlight = false }) {
  const colorClasses = {
    green: 'text-green-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600'
  }

  return (
    <div className={`flex justify-between items-center ${highlight ? 'text-lg font-bold' : ''}`}>
      <span className="text-gray-600">{label}</span>
      <span className={colorClasses[color]}>{value}</span>
    </div>
  )
}
