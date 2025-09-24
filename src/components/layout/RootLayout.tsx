// Root layout component - wraps the entire application
import { Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '../../utils/queryClient';
import { Toaster } from '../ui/Toaster';
import ErrorBoundary from '../ui/ErrorBoundary';

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
        
        {/* Toast notifications container */}
        <Toaster />
        
        {/* React Query DevTools (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </div>
    </QueryClientProvider>
  );
};

export default RootLayout;