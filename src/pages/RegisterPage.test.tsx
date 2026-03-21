import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RegisterPage from './RegisterPage'

// Mock useAuth hook
const mockRegister = vi.fn()
const mockConfirmRegistration = vi.fn()
const mockClearError = vi.fn()

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    register: mockRegister,
    confirmRegistration: mockConfirmRegistration,
    isLoading: false,
    error: null,
    clearError: mockClearError,
  }),
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

const renderRegisterPage = () => {
  return render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>
  )
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders registration form', () => {
      renderRegisterPage()
      expect(screen.getByText('Create your account')).toBeInTheDocument()
      expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Email address')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
    })

    it('shows password requirements hint', () => {
      renderRegisterPage()
      expect(
        screen.getByText('Must include uppercase, lowercase, and a number')
      ).toBeInTheDocument()
    })

    it('has link to login page', () => {
      renderRegisterPage()
      const link = screen.getByText('Sign in')
      expect(link).toBeInTheDocument()
    })
  })

  describe('Password validation', () => {
    it('rejects password shorter than 8 characters', () => {
      renderRegisterPage()

      fireEvent.change(screen.getByLabelText('Email address'), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'Short1' },
      })
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'Short1' },
      })
      fireEvent.submit(screen.getByRole('button', { name: /create account/i }))

      expect(screen.getByText(/8 characters/i)).toBeInTheDocument()
      expect(mockRegister).not.toHaveBeenCalled()
    })

    it('rejects password without uppercase letter', () => {
      renderRegisterPage()

      fireEvent.change(screen.getByLabelText('Email address'), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'lowercase123' },
      })
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'lowercase123' },
      })
      fireEvent.submit(screen.getByRole('button', { name: /create account/i }))

      expect(screen.getByText(/Password must be at least 8 characters/)).toBeInTheDocument()
      expect(mockRegister).not.toHaveBeenCalled()
    })

    it('rejects password without lowercase letter', () => {
      renderRegisterPage()

      fireEvent.change(screen.getByLabelText('Email address'), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'UPPERCASE123' },
      })
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'UPPERCASE123' },
      })
      fireEvent.submit(screen.getByRole('button', { name: /create account/i }))

      expect(screen.getByText(/Password must be at least 8 characters/)).toBeInTheDocument()
      expect(mockRegister).not.toHaveBeenCalled()
    })

    it('rejects password without a number', () => {
      renderRegisterPage()

      fireEvent.change(screen.getByLabelText('Email address'), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'NoNumbersHere' },
      })
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'NoNumbersHere' },
      })
      fireEvent.submit(screen.getByRole('button', { name: /create account/i }))

      expect(screen.getByText(/Password must be at least 8 characters/)).toBeInTheDocument()
      expect(mockRegister).not.toHaveBeenCalled()
    })

    it('rejects mismatched passwords', () => {
      renderRegisterPage()

      fireEvent.change(screen.getByLabelText('Email address'), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'ValidPass1' },
      })
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'DifferentPass1' },
      })
      fireEvent.submit(screen.getByRole('button', { name: /create account/i }))

      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
      expect(mockRegister).not.toHaveBeenCalled()
    })

    it('clears validation error on next submit attempt', () => {
      renderRegisterPage()

      // First: trigger validation error
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'short' },
      })
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'short' },
      })
      fireEvent.submit(screen.getByRole('button', { name: /create account/i }))
      expect(screen.getByText(/8 characters/i)).toBeInTheDocument()

      // Second: fix password and submit again
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'ValidPass1' },
      })
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'ValidPass1' },
      })
      fireEvent.submit(screen.getByRole('button', { name: /create account/i }))

      // Validation error should be cleared
      expect(screen.queryByText(/8 characters/i)).not.toBeInTheDocument()
    })

    it('accepts valid password meeting all requirements', async () => {
      mockRegister.mockResolvedValue(undefined)
      renderRegisterPage()

      fireEvent.change(screen.getByLabelText('Email address'), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'ValidPass1' },
      })
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'ValidPass1' },
      })
      fireEvent.submit(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'ValidPass1', '')
      })
    })
  })
})
