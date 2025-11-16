// Sidebar navigation component
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Activity,
  DollarSign,
  Users,
  ShoppingCart,
  Settings,
  X,
  ChevronRight
} from 'lucide-react';
import { routes, navigation } from '../../router/index';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap = {
  BarChart3,
  Activity,
  DollarSign,
  Users,
  ShoppingCart,
  Settings,
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const mainNavItems = navigation.getMainNavItems();
  const analyticsNavItems = navigation.getAnalyticsNavItems();

  // Get user display name and initials
  const getUserDisplayName = () => {
    if (!user) return 'User';
    // Try to use email, extract name part before @
    if (user.email) {
      const namePart = user.email.split('@')[0];
      // Capitalize first letter
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return user.username || 'User';
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.email) {
      const namePart = user.email.split('@')[0];
      // Get first two characters, uppercase
      return namePart.substring(0, 2).toUpperCase();
    }
    return user.username?.substring(0, 2).toUpperCase() || 'U';
  };

  // Check if a route is active - improved logic to prevent multiple selections
  const isRouteActive = (path: string, itemName: string) => {
    const currentPath = location.pathname;

    // For Dashboard, only active if exactly on /dashboard
    if (path === '/dashboard') {
      return currentPath === '/dashboard';
    }

    // For other routes, check if current path matches or starts with the route
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  // Check if current path exactly matches (for preventing multiple active states)
  const isExactMatch = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0 px-6 mb-8">
                <BarChart3 className="w-8 h-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  BusinessPro
                </span>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-3 space-y-1">
                {mainNavItems.map((item) => {
                  const Icon = iconMap[item.icon as keyof typeof iconMap];
                  const isActiveRoute = isRouteActive(item.path, item.name);
                  const showAnalyticsSubmenu = item.name === 'Analytics' && isActiveRoute;

                  return (
                    <div key={item.name}>
                      <NavLink
                        to={item.path}
                        end={item.path === '/dashboard'}
                        className={() => {
                          return `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            isActiveRoute
                              ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`;
                        }}
                      >
                        <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                        {item.name}

                        {/* Analytics submenu indicator */}
                        {showAnalyticsSubmenu && (
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        )}
                      </NavLink>

                      {/* Analytics submenu */}
                      {showAnalyticsSubmenu && (
                        <div className="ml-8 mt-1 space-y-1">
                          {analyticsNavItems.map((subItem) => (
                            <NavLink
                              key={subItem.name}
                              to={subItem.path}
                              end
                              className={({ isActive: navIsActive }) =>
                                `block px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                                  navIsActive
                                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }`
                              }
                            >
                              {subItem.name}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* User section */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">{getUserInitials()}</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{getUserDisplayName()}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[140px]">{user?.email || 'User'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={onClose} />
      )}

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                BusinessPro
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Mobile navigation */}
          <nav className="flex-1 px-3 pt-4 space-y-1 overflow-y-auto">
            {mainNavItems.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              const isActiveRoute = isRouteActive(item.path, item.name);
              const showAnalyticsSubmenu = item.name === 'Analytics' && isActiveRoute;

              return (
                <div key={item.name}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/dashboard'}
                    onClick={onClose}
                    className={() => {
                      return `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActiveRoute
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`;
                    }}
                  >
                    <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    {item.name}
                  </NavLink>

                  {/* Mobile Analytics submenu */}
                  {showAnalyticsSubmenu && (
                    <div className="ml-8 mt-1 space-y-1">
                      {analyticsNavItems.map((subItem) => (
                        <NavLink
                          key={subItem.name}
                          to={subItem.path}
                          end
                          onClick={onClose}
                          className={({ isActive: navIsActive }) =>
                            `block px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                              navIsActive
                                ? 'bg-indigo-100 text-indigo-700 font-medium'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            }`
                          }
                        >
                          {subItem.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Mobile user section */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">{getUserInitials()}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{getUserDisplayName()}</p>
                <p className="text-xs text-gray-500 truncate max-w-[140px]">{user?.email || 'User'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;