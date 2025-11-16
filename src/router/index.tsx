// React Router configuration with TypeScript
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Layout components
import RootLayout from '../components/layout/RootLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Lazy load page components for code splitting
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage'));
// const AnalyticsOverview = lazy(() => import('../pages/analytics/OverviewPage'));
const AnalyticsOverview = lazy(() => import('../pages/OverviewPage'));

const TrafficAnalytics = lazy(() => import('../pages/TrafficPage'));
const BehaviorAnalytics = lazy(() => import('../pages/BehaviorPage'));
const ConversionAnalytics = lazy(() => import('../pages/ConversionsPage'));
const RevenuePage = lazy(() => import('../pages/RevenuePage'));
const CustomersPage = lazy(() => import('../pages/CustomersPage'));
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Auth pages
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));

// Wrapper component for lazy-loaded components
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  </Suspense>
);

// Router configuration using the new createBrowserRouter API
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      // Auth routes (public)
      {
        path: 'login',
        element: (
          <LazyWrapper>
            <LoginPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'register',
        element: (
          <LazyWrapper>
            <RegisterPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <LazyWrapper>
                <DashboardPage />
              </LazyWrapper>
            ),
          },
          {
            path: 'analytics',
            element: (
              <LazyWrapper>
                <AnalyticsPage />
              </LazyWrapper>
            ),
            children: [
              {
                index: true,
                element: (
                  <LazyWrapper>
                    <AnalyticsOverview />
                  </LazyWrapper>
                ),
              },
              {
                path: 'traffic',
                element: (
                  <LazyWrapper>
                    <TrafficAnalytics />
                  </LazyWrapper>
                ),
              },
              {
                path: 'behavior',
                element: (
                  <LazyWrapper>
                    <BehaviorAnalytics />
                  </LazyWrapper>
                ),
              },
              {
                path: 'conversions',
                element: (
                  <LazyWrapper>
                    <ConversionAnalytics />
                  </LazyWrapper>
                ),
              },
            ],
          },
          {
            path: 'revenue',
            element: (
              <LazyWrapper>
                <RevenuePage />
              </LazyWrapper>
            ),
          },
          {
            path: 'customers',
            element: (
              <LazyWrapper>
                <CustomersPage />
              </LazyWrapper>
            ),
          },
          {
            path: 'products',
            element: (
              <LazyWrapper>
                <ProductsPage />
              </LazyWrapper>
            ),
          },
          {
            path: 'settings',
            element: (
              <LazyWrapper>
                <SettingsPage />
              </LazyWrapper>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: (
      <LazyWrapper>
        <NotFoundPage />
      </LazyWrapper>
    ),
  },
]);

// Route configuration for navigation
export const routes = {
  dashboard: {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'BarChart3',
  },
  analytics: {
    path: '/dashboard/analytics',
    name: 'Analytics',
    icon: 'Activity',
    children: {
      overview: {
        path: '/dashboard/analytics',
        name: 'Overview',
      },
      traffic: {
        path: '/dashboard/analytics/traffic',
        name: 'Traffic Analysis',
      },
      behavior: {
        path: '/dashboard/analytics/behavior',
        name: 'User Behavior',
      },
      conversions: {
        path: '/dashboard/analytics/conversions',
        name: 'Conversions',
      },
    },
  },
  revenue: {
    path: '/dashboard/revenue',
    name: 'Revenue',
    icon: 'DollarSign',
  },
  customers: {
    path: '/dashboard/customers',
    name: 'Customers',
    icon: 'Users',
  },
  products: {
    path: '/dashboard/products',
    name: 'Products',
    icon: 'ShoppingCart',
  },
  settings: {
    path: '/dashboard/settings',
    name: 'Settings',
    icon: 'Settings',
  },
} as const;

// Navigation helper functions
export const navigation = {
  // Get current route info
  getCurrentRoute: (pathname: string) => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return routes.dashboard;
    
    const mainSection = segments[1]; // Skip 'dashboard'
    return routes[mainSection as keyof typeof routes] || routes.dashboard;
  },
  
  // Get breadcrumb trail
  getBreadcrumbs: (pathname: string) => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    if (segments.length >= 1 && segments[0] === 'dashboard') {
      breadcrumbs.push({ name: 'Dashboard', path: '/dashboard' });
      
      if (segments.length >= 2) {
        const section = segments[1];
        const route = routes[section as keyof typeof routes];
        if (route) {
          breadcrumbs.push({ name: route.name, path: route.path });
          
          // Handle nested routes (like analytics subroutes) - Fixed type safety issue
          if (segments.length >= 3 && 'children' in route && route.children) {
            const subsection = segments[2];
            const childRoute = route.children[subsection as keyof typeof route.children];
            if (childRoute) {
              breadcrumbs.push({ name: childRoute.name, path: childRoute.path });
            }
          }
        }
      }
    }
    
    return breadcrumbs;
  },
  
  // Check if route is active
  isActiveRoute: (pathname: string, routePath: string) => {
    return pathname === routePath || pathname.startsWith(routePath + '/');
  },
  
  // Get all main navigation items
  getMainNavItems: () => [
    routes.dashboard,
    routes.analytics,
    routes.revenue,
    routes.customers,
    routes.products,
    routes.settings,
  ],
  
  // Get analytics sub-navigation items
  getAnalyticsNavItems: () => routes.analytics.children ? Object.values(routes.analytics.children) : [],
};

export default router;