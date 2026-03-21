import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

// Mock useAuth hook
let mockAuthState = {
  isAuthenticated: false,
  isLoading: false,
}

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockAuthState,
}))

// Mock LoadingSpinner
vi.mock('../ui/LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}))

// Helper to capture navigated location
let navigatedTo: string | null = null

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Navigate: ({ to, state, replace }: { to: string; state?: unknown; replace?: boolean }) => {
      navigatedTo = to
      return (
        <div
          data-testid="navigate"
          data-to={to}
          data-state={JSON.stringify(state)}
          data-replace={String(replace)}
        />
      )
    },
  }
})

const renderProtectedRoute = (initialPath = '/protected') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    navigatedTo = null
    mockAuthState = {
      isAuthenticated: false,
      isLoading: false,
    }
  })

  it('shows loading spinner when isLoading is true', () => {
    mockAuthState.isLoading = true
    renderProtectedRoute()

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('renders children when isAuthenticated is true', () => {
    mockAuthState.isAuthenticated = true
    renderProtectedRoute()

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to /login when isAuthenticated is false', () => {
    mockAuthState.isAuthenticated = false
    renderProtectedRoute()

    expect(navigatedTo).toBe('/login')
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('passes current location as state when redirecting', () => {
    mockAuthState.isAuthenticated = false
    renderProtectedRoute('/dashboard')

    const navigateEl = screen.getByTestId('navigate')
    const stateAttr = navigateEl.getAttribute('data-state')
    const state = JSON.parse(stateAttr || '{}')

    expect(state.from).toBeDefined()
    expect(state.from.pathname).toBe('/dashboard')
  })

  it('uses replace when redirecting to login', () => {
    mockAuthState.isAuthenticated = false
    renderProtectedRoute()

    const navigateEl = screen.getByTestId('navigate')
    expect(navigateEl.getAttribute('data-replace')).toBe('true')
  })
})
