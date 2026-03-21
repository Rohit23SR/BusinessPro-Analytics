// Header component with breadcrumbs, search, and actions
import { Menu, Search, Bell, Settings, User, ChevronDown, LogOut } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import router, { routes, navigation } from '../../router/index'
import { useAuth } from '../../hooks/useAuth'

interface HeaderProps {
  onMenuClick: () => void
  currentRoute: typeof routes.dashboard
}

interface Breadcrumb {
  name: string
  path: string
}

interface Notification {
  id: number
  type: string
  title: string
  message: string
  time: string
  isRead: boolean
  severity: string
}

interface SearchResult {
  id: string
  title: string
  description: string
  path: string
  icon: string
  category: 'page' | 'report' | 'action' | 'setting'
}

const Header = ({ onMenuClick, currentRoute }: HeaderProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth()

  // Get timeframe from URL parameters or default to 30d
  const searchParams = new URLSearchParams(location.search)
  const [timeframe, setTimeframe] = useState(searchParams.get('timeframe') || '30d')

  // Get breadcrumbs from router navigation helper
  const breadcrumbs: Breadcrumb[] = navigation.getBreadcrumbs(location.pathname)

  // Searchable items
  const searchableItems: SearchResult[] = [
    // Pages
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      description: 'Main dashboard with KPIs and metrics',
      path: '/dashboard',
      icon: '📊',
      category: 'page',
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Detailed analytics and insights',
      path: '/dashboard/analytics',
      icon: '📈',
      category: 'page',
    },
    {
      id: 'traffic',
      title: 'Traffic Analysis',
      description: 'Website traffic sources and trends',
      path: '/dashboard/analytics/traffic',
      icon: '🌐',
      category: 'page',
    },
    {
      id: 'behavior',
      title: 'User Behavior',
      description: 'User behavior patterns and engagement',
      path: '/dashboard/analytics/behavior',
      icon: '👥',
      category: 'page',
    },
    {
      id: 'conversions',
      title: 'Conversions',
      description: 'Conversion funnel and rates',
      path: '/dashboard/analytics/conversions',
      icon: '🎯',
      category: 'page',
    },
    {
      id: 'revenue',
      title: 'Revenue',
      description: 'Revenue trends and financial metrics',
      path: '/dashboard/revenue',
      icon: '💰',
      category: 'page',
    },
    {
      id: 'customers',
      title: 'Customers',
      description: 'Customer data and segments',
      path: '/dashboard/customers',
      icon: '👤',
      category: 'page',
    },
    {
      id: 'products',
      title: 'Products',
      description: 'Product performance and inventory',
      path: '/dashboard/products',
      icon: '🛍️',
      category: 'page',
    },
    // Reports
    {
      id: 'monthly-report',
      title: 'Monthly Report',
      description: 'Generate monthly performance report',
      path: '/dashboard/analytics?report=monthly',
      icon: '📄',
      category: 'report',
    },
    {
      id: 'revenue-report',
      title: 'Revenue Report',
      description: 'Detailed revenue breakdown',
      path: '/dashboard/revenue?report=detailed',
      icon: '💵',
      category: 'report',
    },
    {
      id: 'traffic-report',
      title: 'Traffic Report',
      description: 'Traffic sources analysis',
      path: '/dashboard/analytics/traffic?report=sources',
      icon: '📊',
      category: 'report',
    },
    {
      id: 'conversion-report',
      title: 'Conversion Report',
      description: 'Conversion funnel analysis',
      path: '/dashboard/analytics/conversions?report=funnel',
      icon: '📈',
      category: 'report',
    },
    {
      id: 'customer-report',
      title: 'Customer Report',
      description: 'Customer acquisition and retention',
      path: '/dashboard/customers?report=acquisition',
      icon: '👥',
      category: 'report',
    },
    // Settings
    {
      id: 'settings-profile',
      title: 'Profile Settings',
      description: 'Manage your account profile',
      path: '/dashboard/settings?tab=profile',
      icon: '⚙️',
      category: 'setting',
    },
    {
      id: 'settings-notifications',
      title: 'Notification Settings',
      description: 'Configure notification preferences',
      path: '/dashboard/settings?tab=notifications',
      icon: '🔔',
      category: 'setting',
    },
    {
      id: 'settings-dashboard',
      title: 'Dashboard Settings',
      description: 'Customize dashboard layout',
      path: '/dashboard/settings?tab=dashboard',
      icon: '🎨',
      category: 'setting',
    },
    {
      id: 'settings-integrations',
      title: 'Integrations',
      description: 'Connect third-party services',
      path: '/dashboard/settings?tab=integrations',
      icon: '🔗',
      category: 'setting',
    },
    // Quick Actions
    {
      id: 'export-data',
      title: 'Export Data',
      description: 'Download your data as CSV',
      path: '/dashboard?action=export',
      icon: '📥',
      category: 'action',
    },
    {
      id: 'refresh-data',
      title: 'Refresh Data',
      description: 'Reload all dashboard data',
      path: '/dashboard?action=refresh',
      icon: '🔄',
      category: 'action',
    },
  ]

  // Filter search results
  const filteredResults = searchQuery.trim()
    ? searchableItems
        .filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 8)
    : []

  const timeframeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '6m', label: 'Last 6 months' },
    { value: '12m', label: 'Last 12 months' },
  ]

  const settingsMenuItems = [
    { id: 'profile', name: 'Profile & Account', icon: '👤' },
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' },
  ]

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'alert',
      title: 'High Traffic Alert',
      message: 'Website traffic increased by 150% in the last hour',
      time: '2 minutes ago',
      isRead: false,
      severity: 'high',
    },
    {
      id: 2,
      type: 'success',
      title: 'Monthly Report Ready',
      message: 'Your analytics report for September is now available',
      time: '1 hour ago',
      isRead: false,
      severity: 'low',
    },
    {
      id: 3,
      type: 'warning',
      title: 'Conversion Rate Drop',
      message: 'Conversion rate decreased by 12% compared to last week',
      time: '3 hours ago',
      isRead: true,
      severity: 'medium',
    },
    {
      id: 4,
      type: 'info',
      title: 'New Integration Available',
      message: 'Shopify integration is now available in your dashboard',
      time: '1 day ago',
      isRead: true,
      severity: 'low',
    },
    {
      id: 5,
      type: 'alert',
      title: 'Server Response Time',
      message: 'Average response time increased to 2.3 seconds',
      time: '2 days ago',
      isRead: true,
      severity: 'medium',
    },
  ])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const currentTimeframeLabel =
    timeframeOptions.find((option) => option.value === timeframe)?.label || 'Last 30 days'

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowSearchResults(value.trim().length > 0)
    setSelectedResultIndex(-1)
  }

  // Handle search result selection
  const handleSearchResultClick = (result: SearchResult) => {
    navigate(result.path)
    setSearchQuery('')
    setShowSearchResults(false)
    setSelectedResultIndex(-1)
  }

  // Handle keyboard navigation in search
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSearchResults || filteredResults.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedResultIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedResultIndex((prev) => (prev > 0 ? prev - 1 : prev))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedResultIndex >= 0 && selectedResultIndex < filteredResults.length) {
          handleSearchResultClick(filteredResults[selectedResultIndex])
        }
        break
      case 'Escape':
        setShowSearchResults(false)
        setSelectedResultIndex(-1)
        searchInputRef.current?.blur()
        break
    }
  }

  // Get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'page':
        return 'Page'
      case 'report':
        return 'Report'
      case 'action':
        return 'Action'
      case 'setting':
        return 'Setting'
      default:
        return category
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'page':
        return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
      case 'report':
        return 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
      case 'action':
        return 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400'
      case 'setting':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
    }
  }

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe)

    // Update URL with the new timeframe parameter
    const newSearchParams = new URLSearchParams(location.search)
    newSearchParams.set('timeframe', newTimeframe)

    // Navigate to the same path with updated search params
    navigate(
      {
        pathname: location.pathname,
        search: newSearchParams.toString(),
      },
      { replace: true }
    )
  }

  const handleSettingsClick = () => {
    navigate('/dashboard/settings')
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return '⚠️'
      case 'success':
        return '✅'
      case 'warning':
        return '⚡'
      case 'info':
        return '💡'
      default:
        return '🔔'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-orange-600'
      case 'low':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  const handleSettingsNavigation = (tabId: string) => {
    try {
      navigate(`/dashboard/settings?tab=${tabId}`)
      setShowUserMenu(false)
    } catch (error) {
      console.error('Navigation error:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setShowUserMenu(false)
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Breadcrumbs */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.path} className="flex items-center">
                  {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {crumb.name}
                    </span>
                  ) : (
                    <button
                      onClick={() => navigate(crumb.path)}
                      className="text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {crumb.name}
                    </button>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Center section - Search */}
        <div className="mx-8 hidden max-w-lg flex-1 sm:block" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
              placeholder="Search dashboards, reports... (↑↓ to navigate, Enter to select)"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-12 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:bg-gray-600"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setShowSearchResults(false)
                  searchInputRef.current?.focus()
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            )}

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                {filteredResults.length > 0 ? (
                  <>
                    <div className="border-b border-gray-100 bg-gray-50 px-4 py-2 dark:border-gray-600 dark:bg-gray-700">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}{' '}
                        found
                      </p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {filteredResults.map((result, index) => (
                        <button
                          key={result.id}
                          onClick={() => handleSearchResultClick(result)}
                          onMouseEnter={() => setSelectedResultIndex(index)}
                          className={`flex w-full items-start space-x-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                            index === selectedResultIndex
                              ? 'border-l-4 border-l-indigo-500 bg-indigo-50 dark:border-l-indigo-400 dark:bg-indigo-900/30'
                              : 'border-l-4 border-l-transparent'
                          }`}
                        >
                          <span className="mt-0.5 flex-shrink-0 text-xl">{result.icon}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {result.title}
                              </p>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryColor(result.category)}`}
                              >
                                {getCategoryLabel(result.category)}
                              </span>
                            </div>
                            <p className="mt-1 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                              {result.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 dark:border-gray-600 dark:bg-gray-700">
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Press{' '}
                        <kbd className="rounded bg-gray-200 px-1.5 py-0.5 font-mono text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                          ↵
                        </kbd>{' '}
                        to select,{' '}
                        <kbd className="rounded bg-gray-200 px-1.5 py-0.5 font-mono text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                          Esc
                        </kbd>{' '}
                        to close
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <Search className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      No results found
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Try searching for "dashboard", "report", or "settings"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Time range selector - Hidden on mobile */}
          <div className="relative hidden md:block">
            <select
              value={timeframe}
              onChange={(e) => handleTimeframeChange(e.target.value)}
              className="cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-sm font-medium text-gray-700 outline-none hover:bg-gray-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              {timeframeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={handleNotificationClick}
              className="relative rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="fixed right-2 z-50 mt-2 max-h-[80vh] w-[calc(100vw-1rem)] max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 sm:absolute sm:right-0 sm:max-h-[500px] sm:w-96">
                {/* Header */}
                <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-2 dark:border-gray-700 dark:from-indigo-900/20 dark:to-purple-900/20 sm:px-4 sm:py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-3 w-3 text-indigo-600 dark:text-indigo-400 sm:h-4 sm:w-4" />
                      <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 sm:text-sm">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications list */}
                <div className="max-h-[60vh] divide-y divide-gray-100 overflow-y-auto dark:divide-gray-700 sm:max-h-[380px]">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Bell className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`group cursor-pointer px-3 py-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 sm:px-4 sm:py-3 ${
                          !notification.isRead
                            ? 'border-l-4 border-l-indigo-500 bg-gradient-to-r from-blue-50/50 to-transparent dark:border-l-indigo-400 dark:from-blue-900/20 dark:to-transparent'
                            : 'border-l-4 border-l-transparent'
                        }`}
                      >
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <div
                            className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8 ${
                              notification.type === 'alert'
                                ? 'bg-red-100 dark:bg-red-900/30'
                                : notification.type === 'success'
                                  ? 'bg-green-100 dark:bg-green-900/30'
                                  : notification.type === 'warning'
                                    ? 'bg-orange-100 dark:bg-orange-900/30'
                                    : 'bg-blue-100 dark:bg-blue-900/30'
                            }`}
                          >
                            <span className="text-base">
                              {getNotificationIcon(notification.type)}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center justify-between">
                              <p
                                className={`text-sm font-semibold ${
                                  !notification.isRead
                                    ? 'text-gray-900 dark:text-gray-100'
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <span className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-indigo-500 dark:bg-indigo-400"></span>
                              )}
                            </div>
                            <p
                              className={`line-clamp-2 text-sm ${
                                !notification.isRead
                                  ? 'text-gray-700 dark:text-gray-300'
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}
                            >
                              {notification.message}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                {notification.time}
                              </p>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs ${
                                  notification.severity === 'high'
                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    : notification.severity === 'medium'
                                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                }`}
                              >
                                {notification.severity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 bg-gray-50/50 px-3 py-2 dark:border-gray-700 dark:bg-gray-700/50 sm:px-4 sm:py-3">
                  <button
                    onClick={() => {
                      navigate('/dashboard/settings?tab=notifications')
                      setShowNotifications(false)
                    }}
                    className="w-full rounded-md py-1 text-center text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300 sm:text-sm"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings - Hidden on mobile (accessible via user menu) */}
          <button
            onClick={handleSettingsClick}
            className="hidden rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 sm:block"
          >
            <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500">
                <span className="text-sm font-medium text-white">RS</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 dark:text-gray-500 ${
                  showUserMenu ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:w-64">
                {/* User Info Section */}
                <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500">
                      <span className="text-sm font-medium text-white">
                        {user?.email ? user.email.substring(0, 2).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user?.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {user?.email || 'Not signed in'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Settings Menu Items */}
                <div className="py-2">
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      Settings
                    </p>
                  </div>
                  {settingsMenuItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleSettingsNavigation(item.id)
                      }}
                      className="flex w-full cursor-pointer items-center px-4 py-2 text-left text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <span className="mr-3 text-base">{item.icon}</span>
                      {item.name}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="border-t border-gray-100 pt-2 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleLogout()
                    }}
                    className="flex w-full cursor-pointer items-center px-4 py-2 text-left text-sm text-red-600 transition-colors duration-200 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
