// Sidebar navigation component
import { NavLink, useLocation } from 'react-router-dom'
import {
  BarChart3,
  Activity,
  DollarSign,
  Users,
  ShoppingCart,
  Settings,
  X,
  ChevronRight,
} from 'lucide-react'
import { routes, navigation } from '../../router/index'
import { useAuth } from '../../hooks/useAuth'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const iconMap = {
  BarChart3,
  Activity,
  DollarSign,
  Users,
  ShoppingCart,
  Settings,
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation()
  const { user } = useAuth()
  const mainNavItems = navigation.getMainNavItems()
  const analyticsNavItems = navigation.getAnalyticsNavItems()

  // Get user display name and initials
  const getUserDisplayName = () => {
    if (!user) return 'User'
    // Try to use email, extract name part before @
    if (user.email) {
      const namePart = user.email.split('@')[0]
      // Capitalize first letter
      return namePart.charAt(0).toUpperCase() + namePart.slice(1)
    }
    return user.username || 'User'
  }

  const getUserInitials = () => {
    if (!user) return 'U'
    if (user.email) {
      const namePart = user.email.split('@')[0]
      // Get first two characters, uppercase
      return namePart.substring(0, 2).toUpperCase()
    }
    return user.username?.substring(0, 2).toUpperCase() || 'U'
  }

  // Check if a route is active - improved logic to prevent multiple selections
  const isRouteActive = (path: string, itemName: string) => {
    const currentPath = location.pathname

    // For Dashboard, only active if exactly on /dashboard
    if (path === '/dashboard') {
      return currentPath === '/dashboard'
    }

    // For other routes, check if current path matches or starts with the route
    return currentPath === path || currentPath.startsWith(path + '/')
  }

  // Check if current path exactly matches (for preventing multiple active states)
  const isExactMatch = (path: string) => {
    return location.pathname === path
  }

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex w-64 flex-col">
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
              {/* Logo */}
              <div className="mb-8 flex flex-shrink-0 items-center px-6">
                <BarChart3 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                  BusinessPro
                </span>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1 px-3">
                {mainNavItems.map((item) => {
                  const Icon = iconMap[item.icon as keyof typeof iconMap]
                  const isActiveRoute = isRouteActive(item.path, item.name)
                  const showAnalyticsSubmenu = item.name === 'Analytics' && isActiveRoute

                  return (
                    <div key={item.name}>
                      <NavLink
                        to={item.path}
                        end={item.path === '/dashboard'}
                        className={() => {
                          return `group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                            isActiveRoute
                              ? 'border-r-2 border-indigo-700 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-gray-700 dark:text-indigo-400'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100'
                          }`
                        }}
                      >
                        <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        {item.name}

                        {/* Analytics submenu indicator */}
                        {showAnalyticsSubmenu && <ChevronRight className="ml-auto h-4 w-4" />}
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
                                `block rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${
                                  navIsActive
                                    ? 'bg-indigo-100 font-medium text-indigo-700 dark:bg-gray-600 dark:text-indigo-400'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                                }`
                              }
                            >
                              {subItem.name}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </nav>
            </div>

            {/* User section */}
            <div className="flex flex-shrink-0 border-t border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500">
                  <span className="text-sm font-medium text-white">{getUserInitials()}</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {getUserDisplayName()}
                  </p>
                  <p className="max-w-[140px] truncate text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || 'User'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={onClose} />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out dark:bg-gray-800 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Mobile header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                BusinessPro
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Mobile navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 pt-4">
            {mainNavItems.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap]
              const isActiveRoute = isRouteActive(item.path, item.name)
              const showAnalyticsSubmenu = item.name === 'Analytics' && isActiveRoute

              return (
                <div key={item.name}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/dashboard'}
                    onClick={onClose}
                    className={() => {
                      return `group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                        isActiveRoute
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-gray-700 dark:text-indigo-400'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100'
                      }`
                    }}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
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
                            `block rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${
                              navIsActive
                                ? 'bg-indigo-100 font-medium text-indigo-700 dark:bg-gray-600 dark:text-indigo-400'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                            }`
                          }
                        >
                          {subItem.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Mobile user section */}
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500">
                <span className="text-sm font-medium text-white">{getUserInitials()}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {getUserDisplayName()}
                </p>
                <p className="max-w-[140px] truncate text-xs text-gray-500 dark:text-gray-400">
                  {user?.email || 'User'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
