// Header component with breadcrumbs, search, and actions
import { Menu, Search, Bell, Settings, User, ChevronDown, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import router, { routes, navigation } from '../../router/index';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onMenuClick: () => void;
  currentRoute: typeof routes.dashboard;
}

interface Breadcrumb {
  name: string;
  path: string;
}

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  severity: string;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: string;
  category: 'page' | 'report' | 'action' | 'setting';
}

const Header = ({ onMenuClick, currentRoute }: HeaderProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  // Get timeframe from URL parameters or default to 30d
  const searchParams = new URLSearchParams(location.search);
  const [timeframe, setTimeframe] = useState(searchParams.get('timeframe') || '30d');

  // Get breadcrumbs from router navigation helper
  const breadcrumbs: Breadcrumb[] = navigation.getBreadcrumbs(location.pathname);

  // Searchable items
  const searchableItems: SearchResult[] = [
    // Pages
    { id: 'dashboard', title: 'Dashboard Overview', description: 'Main dashboard with KPIs and metrics', path: '/dashboard', icon: '📊', category: 'page' },
    { id: 'analytics', title: 'Analytics', description: 'Detailed analytics and insights', path: '/dashboard/analytics', icon: '📈', category: 'page' },
    { id: 'traffic', title: 'Traffic Analysis', description: 'Website traffic sources and trends', path: '/dashboard/analytics/traffic', icon: '🌐', category: 'page' },
    { id: 'behavior', title: 'User Behavior', description: 'User behavior patterns and engagement', path: '/dashboard/analytics/behavior', icon: '👥', category: 'page' },
    { id: 'conversions', title: 'Conversions', description: 'Conversion funnel and rates', path: '/dashboard/analytics/conversions', icon: '🎯', category: 'page' },
    { id: 'revenue', title: 'Revenue', description: 'Revenue trends and financial metrics', path: '/dashboard/revenue', icon: '💰', category: 'page' },
    { id: 'customers', title: 'Customers', description: 'Customer data and segments', path: '/dashboard/customers', icon: '👤', category: 'page' },
    { id: 'products', title: 'Products', description: 'Product performance and inventory', path: '/dashboard/products', icon: '🛍️', category: 'page' },
    // Reports
    { id: 'monthly-report', title: 'Monthly Report', description: 'Generate monthly performance report', path: '/dashboard/analytics?report=monthly', icon: '📄', category: 'report' },
    { id: 'revenue-report', title: 'Revenue Report', description: 'Detailed revenue breakdown', path: '/dashboard/revenue?report=detailed', icon: '💵', category: 'report' },
    { id: 'traffic-report', title: 'Traffic Report', description: 'Traffic sources analysis', path: '/dashboard/analytics/traffic?report=sources', icon: '📊', category: 'report' },
    { id: 'conversion-report', title: 'Conversion Report', description: 'Conversion funnel analysis', path: '/dashboard/analytics/conversions?report=funnel', icon: '📈', category: 'report' },
    { id: 'customer-report', title: 'Customer Report', description: 'Customer acquisition and retention', path: '/dashboard/customers?report=acquisition', icon: '👥', category: 'report' },
    // Settings
    { id: 'settings-profile', title: 'Profile Settings', description: 'Manage your account profile', path: '/dashboard/settings?tab=profile', icon: '⚙️', category: 'setting' },
    { id: 'settings-notifications', title: 'Notification Settings', description: 'Configure notification preferences', path: '/dashboard/settings?tab=notifications', icon: '🔔', category: 'setting' },
    { id: 'settings-dashboard', title: 'Dashboard Settings', description: 'Customize dashboard layout', path: '/dashboard/settings?tab=dashboard', icon: '🎨', category: 'setting' },
    { id: 'settings-integrations', title: 'Integrations', description: 'Connect third-party services', path: '/dashboard/settings?tab=integrations', icon: '🔗', category: 'setting' },
    // Quick Actions
    { id: 'export-data', title: 'Export Data', description: 'Download your data as CSV', path: '/dashboard?action=export', icon: '📥', category: 'action' },
    { id: 'refresh-data', title: 'Refresh Data', description: 'Reload all dashboard data', path: '/dashboard?action=refresh', icon: '🔄', category: 'action' },
  ];

  // Filter search results
  const filteredResults = searchQuery.trim()
    ? searchableItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  const timeframeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '6m', label: 'Last 6 months' },
    { value: '12m', label: 'Last 12 months' },
  ];

  const settingsMenuItems = [
    { id: 'profile', name: 'Profile & Account', icon: '👤' },
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' }
  ];

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'alert',
      title: 'High Traffic Alert',
      message: 'Website traffic increased by 150% in the last hour',
      time: '2 minutes ago',
      isRead: false,
      severity: 'high'
    },
    {
      id: 2,
      type: 'success',
      title: 'Monthly Report Ready',
      message: 'Your analytics report for September is now available',
      time: '1 hour ago',
      isRead: false,
      severity: 'low'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Conversion Rate Drop',
      message: 'Conversion rate decreased by 12% compared to last week',
      time: '3 hours ago',
      isRead: true,
      severity: 'medium'
    },
    {
      id: 4,
      type: 'info',
      title: 'New Integration Available',
      message: 'Shopify integration is now available in your dashboard',
      time: '1 day ago',
      isRead: true,
      severity: 'low'
    },
    {
      id: 5,
      type: 'alert',
      title: 'Server Response Time',
      message: 'Average response time increased to 2.3 seconds',
      time: '2 days ago',
      isRead: true,
      severity: 'medium'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };
  
  const currentTimeframeLabel = timeframeOptions.find(
    option => option.value === timeframe
  )?.label || 'Last 30 days';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.trim().length > 0);
    setSelectedResultIndex(-1);
  };

  // Handle search result selection
  const handleSearchResultClick = (result: SearchResult) => {
    navigate(result.path);
    setSearchQuery('');
    setShowSearchResults(false);
    setSelectedResultIndex(-1);
  };

  // Handle keyboard navigation in search
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSearchResults || filteredResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedResultIndex(prev =>
          prev < filteredResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedResultIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedResultIndex >= 0 && selectedResultIndex < filteredResults.length) {
          handleSearchResultClick(filteredResults[selectedResultIndex]);
        }
        break;
      case 'Escape':
        setShowSearchResults(false);
        setSelectedResultIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  };

  // Get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'page': return 'Page';
      case 'report': return 'Report';
      case 'action': return 'Action';
      case 'setting': return 'Setting';
      default: return category;
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'page': return 'bg-blue-100 text-blue-700';
      case 'report': return 'bg-green-100 text-green-700';
      case 'action': return 'bg-purple-100 text-purple-700';
      case 'setting': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    
    // Update URL with the new timeframe parameter
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('timeframe', newTimeframe);
    
    // Navigate to the same path with updated search params
    navigate({
      pathname: location.pathname,
      search: newSearchParams.toString()
    }, { replace: true });
  };

  const handleSettingsClick = () => {
    navigate('/dashboard/settings');
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert': return '⚠️';
      case 'success': return '✅';
      case 'warning': return '⚡';
      case 'info': return '💡';
      default: return '🔔';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const handleSettingsNavigation = (tabId: string) => {
    navigate(`/dashboard/settings?tab=${tabId}`);
    setShowUserMenu(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>

          {/* Breadcrumbs */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.path} className="flex items-center">
                  {index > 0 && (
                    <span className="mx-2 text-gray-400">/</span>
                  )}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-sm font-medium text-gray-900">
                      {crumb.name}
                    </span>
                  ) : (
                    <button
                      onClick={() => navigate(crumb.path)}
                      className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
        <div className="flex-1 max-w-lg mx-8 hidden sm:block" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
              placeholder="Search dashboards, reports... (↑↓ to navigate, Enter to select)"
              className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                  searchInputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                {filteredResults.length > 0 ? (
                  <>
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                      <p className="text-xs font-medium text-gray-500">
                        {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found
                      </p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {filteredResults.map((result, index) => (
                        <button
                          key={result.id}
                          onClick={() => handleSearchResultClick(result)}
                          onMouseEnter={() => setSelectedResultIndex(index)}
                          className={`w-full px-4 py-3 flex items-start space-x-3 hover:bg-gray-50 transition-colors text-left ${
                            index === selectedResultIndex ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'
                          }`}
                        >
                          <span className="text-xl flex-shrink-0 mt-0.5">{result.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {result.title}
                              </p>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColor(result.category)}`}>
                                {getCategoryLabel(result.category)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {result.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                      <p className="text-xs text-gray-400">
                        Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600 font-mono">↵</kbd> to select, <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600 font-mono">Esc</kbd> to close
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-900">No results found</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Try searching for "dashboard", "report", or "settings"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Time range selector */}
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => handleTimeframeChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer"
            >
              {timeframeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={handleNotificationClick}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-indigo-600" />
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications list */}
                <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`px-4 py-3 hover:bg-gray-50 transition-all duration-200 cursor-pointer group ${
                          !notification.isRead ? 'bg-gradient-to-r from-blue-50/50 to-transparent border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center ${
                            notification.type === 'alert' ? 'bg-red-100' :
                            notification.type === 'success' ? 'bg-green-100' :
                            notification.type === 'warning' ? 'bg-orange-100' :
                            'bg-blue-100'
                          }`}>
                            <span className="text-base">{getNotificationIcon(notification.type)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className={`text-sm font-semibold ${
                                !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <span className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                              )}
                            </div>
                            <p className={`text-sm line-clamp-2 ${
                              !notification.isRead ? 'text-gray-700' : 'text-gray-500'
                            }`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-400">
                                {notification.time}
                              </p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                notification.severity === 'high' ? 'bg-red-100 text-red-700' :
                                notification.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
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
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                  <button
                    onClick={() => {
                      navigate('/dashboard/settings?tab=notifications');
                      setShowNotifications(false);
                    }}
                    className="w-full text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium py-1 hover:bg-indigo-50 rounded-md transition-colors"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button
            onClick={handleSettingsClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">RS</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                showUserMenu ? 'rotate-180' : ''
              }`} />
            </button>
            
            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.email ? user.email.substring(0, 2).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user?.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email || 'Not signed in'}</p>
                    </div>
                  </div>
                </div>

                {/* Settings Menu Items */}
                <div className="py-2">
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Settings
                    </p>
                  </div>
                  {settingsMenuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSettingsNavigation(item.id)}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <span className="mr-3 text-base">{item.icon}</span>
                      {item.name}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;