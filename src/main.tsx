import './index.css'
import { AppInitializer, NotificationProvider } from './features/shared/core/core'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from '@/config/store/store'
import { StrictMode } from 'react'
import { Toaster } from 'sonner'
import AppRouter from './router'

const queryClient = new QueryClient;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider container={<Toaster />}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <AppInitializer>
            <AppRouter />
          </AppInitializer>
        </Provider>
      </QueryClientProvider>
    </NotificationProvider>
  </StrictMode>,
)
