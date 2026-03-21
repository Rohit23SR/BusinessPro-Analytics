import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './LoginPage'

// Mock useAuth hook
const mockLogin = vi.fn()
const mockClearError = vi.fn()

let mockAuthState = {
  login: mockLogin,
  isLoading: false,
  error: null as string | null,
  clearError: mockClearError,
}

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => mockAuthState,
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderLoginPage = () => {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuthState = {
      login: mockLogin,
      isLoading: false,
      error: null,
      clearError: mockClearError,
    }
  })

  describe('Rendering', () => {
    it('renders email input', () => {
      renderLoginPage()
      expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument()
    })

    it('renders password input', () => {
      renderLoginPage()
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    })

    it('renders Sign in button', () => {
      renderLoginPage()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('renders link to register page', () => {
      renderLoginPage()
      const link = screen.getByText('create a new account')
      expect(link).toBeInTheDocument()
      expect(link.closest('a')).toHaveAttribute('href', '/register')
    })

    it('renders forgot password link', () => {
      renderLoginPage()
      const link = screen.getByText('Forgot your password?')
      expect(link).toBeInTheDocument()
      expect(link.closest('a')).toHaveAttribute('href', '/forgot-password')
    })
  })

  describe('Error display', () => {
    it('shows error message when error exists', () => {
      mockAuthState.error = 'Invalid credentials'
      renderLoginPage()
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })

    it('does not show error section when error is null', () => {
      mockAuthState.error = null
      renderLoginPage()
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument()
    })
  })

  describe('Loading state', () => {
    it('shows loading spinner when isLoading is true', () => {
      mockAuthState.isLoading = true
      renderLoginPage()
      // When loading, the button text changes to a spinner
      expect(screen.queryByRole('button', { name: /sign in/i })).not.toBeInTheDocument()
    })

    it('disables button when isLoading is true', () => {
      mockAuthState.isLoading = true
      renderLoginPage()
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('Form submission', () => {
    it('calls clearError and login on form submit', async () => {
      mockLogin.mockResolvedValue(undefined)
      renderLoginPage()

      fireEvent.change(screen.getByPlaceholderText('Email address'), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'MyPassword1' },
      })
      fireEvent.submit(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalled()
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'MyPassword1')
      })
    })

    it('navigates to /dashboard on successful login', async () => {
      mockLogin.mockResolvedValue(undefined)
      renderLoginPage()

      fireEvent.change(screen.getByPlaceholderText('Email address'), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'MyPassword1' },
      })
      fireEvent.submit(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
      })
    })

    it('does not navigate when login throws an error', async () => {
      mockLogin.mockRejectedValue(new Error('Invalid credentials'))
      renderLoginPage()

      fireEvent.change(screen.getByPlaceholderText('Email address'), {
        target: { value: 'bad@example.com' },
      })
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'wrong' },
      })
      fireEvent.submit(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled()
      })

      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })
})
