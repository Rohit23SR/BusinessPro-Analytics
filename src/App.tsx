// Main App component
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';
import { router } from './router';
import { queryClient } from './utils/queryClient';
import { AuthProvider } from './hooks/useAuth';
import { configureAmplify } from './utils/amplifyConfig';
import LoadingSpinner from './components/ui/LoadingSpinner';
import './index.css';

function App() {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      await configureAmplify();
      setIsConfigured(true);
    };
    initApp();
  }, []);

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;