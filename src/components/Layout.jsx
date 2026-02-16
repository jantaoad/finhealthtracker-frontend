import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, LogOut, LayoutDashboard, CreditCard, PiggyBank, Target, Lightbulb } from 'lucide-react'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-600 to-indigo-600 shadow-2xl transition-all duration-300 flex flex-col text-white`}>
        {/* Logo */}
        <div className="p-6 border-b border-blue-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold">
              FH
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg">FinHealth</h1>
                <p className="text-xs text-blue-100">Tracker</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <NavItem
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Dashboard"
            href="/dashboard"
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<CreditCard className="w-5 h-5" />}
            label="Transactions"
            href="/transactions"
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<PiggyBank className="w-5 h-5" />}
            label="Budgets"
            href="/budgets"
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<Target className="w-5 h-5" />}
            label="Goals"
            href="/goals"
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<Lightbulb className="w-5 h-5" />}
            label="Insights"
            href="/insights"
            collapsed={!sidebarOpen}
          />
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-blue-500/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-white hover:bg-blue-500/30 p-3 rounded-lg transition font-medium"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
            <div className="h-8 w-0.5 bg-gray-200"></div>
            <h2 className="text-xl font-semibold text-gray-900">FinHealthTracker</h2>
          </div>

          <div className="text-sm text-gray-600 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function NavItem({ icon, label, href, collapsed }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-blue-100 hover:text-white transition font-medium"
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </a>
  )
}
