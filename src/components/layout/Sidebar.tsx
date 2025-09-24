// Sidebar navigation component
import { NavLink } from 'react-router-dom';
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
import { useNavigation } from '../../hooks/useNavigation';
import { navigation } from '../../router';

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
  const { isActive } = useNavigation();
  const mainNavItems = navigation.getMainNavItems();
  const analyticsNavItems = navigation.getAnalyticsNavItems();

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
                  const isActiveRoute = isActive(item.path);
                  
                  return (
                    <div key={item.name}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            isActive || isActiveRoute
                              ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`
                        }
                      >
                        <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                        {item.name}
                        
                        {/* Analytics submenu indicator */}
                        {item.name === 'Analytics' && isActiveRoute && (
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        )}
                      </NavLink>

                      {/* Analytics submenu */}
                      {item.name === 'Analytics' && isActiveRoute && (
                        <div className="ml-8 mt-1 space-y-1">
                          {analyticsNavItems.map((subItem) => (
                            <NavLink
                              key={subItem.name}
                              to={subItem.path}
                              className={({ isActive }) =>
                                `block px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                                  isActive
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
                  <span className="text-sm font-medium text-white">JD</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">John Doe</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              const isActiveRoute = isActive(item.path);
              
              return (
                <div key={item.name}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive || isActiveRoute
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    {item.name}
                  </NavLink>

                  {/* Mobile Analytics submenu */}
                  {item.name === 'Analytics' && isActiveRoute && (
                    <div className="ml-8 mt-1 space-y-1">
                      {analyticsNavItems.map((subItem) => (
                        <NavLink
                          key={subItem.name}
                          to={subItem.path}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `block px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                              isActive
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
                <span className="text-sm font-medium text-white">JD</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">John Doe</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;