// Header component with breadcrumbs, search, and actions
import { Menu, Search, Bell, Settings, User, ChevronDown, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import router, { routes, navigation } from '../../router/index';

interface HeaderProps {
  onMenuClick: () => void;
  currentRoute: typeof routes.dashboard;
}

interface Breadcrumb {
  name: string;
  path: string;
}

const Header = ({ onMenuClick, currentRoute }: HeaderProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [timeframe, setTimeframe] = useState('30d');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get breadcrumbs from router navigation helper
  const breadcrumbs: Breadcrumb[] = navigation.getBreadcrumbs(location.pathname);

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

  const notifications = [
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
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;
  
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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    setShowUserMenu(false);
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
                  <span className={`text-sm font-medium ${
                    index === breadcrumbs.length - 1
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}>
                    {crumb.name}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search dashboards, reports..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-200"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Time range selector */}
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
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
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs text-gray-500">{unreadCount} unread</span>
                    )}
                  </div>
                </div>

                {/* Notifications list */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${getSeverityColor(notification.severity)}`}>
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
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
                <span className="text-sm font-medium text-white">JD</span>
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
                      <span className="text-sm font-medium text-white">JD</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">John Doe</p>
                      <p className="text-xs text-gray-500">john.doe@company.com</p>
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