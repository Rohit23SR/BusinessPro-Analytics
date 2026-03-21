import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import { AuthProvider, useAuth } from './useAuth'

// Mock aws-amplify/auth
const mockSignIn = vi.fn()
const mockSignUp = vi.fn()
const mockConfirmSignUp = vi.fn()
const mockSignOut = vi.fn()
const mockGetCurrentUser = vi.fn()
const mockFetchAuthSession = vi.fn()
const mockResetPassword = vi.fn()
const mockConfirmResetPassword = vi.fn()

vi.mock('aws-amplify/auth', () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
  signUp: (...args: unknown[]) => mockSignUp(...args),
  confirmSignUp: (...args: unknown[]) => mockConfirmSignUp(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
  getCurrentUser: (...args: unknown[]) => mockGetCurrentUser(...args),
  fetchAuthSession: (...args: unknown[]) => mockFetchAuthSession(...args),
  resetPassword: (...args: unknown[]) => mockResetPassword(...args),
  confirmResetPassword: (...args: unknown[]) => mockConfirmResetPassword(...args),
}))

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default: checkAuthStatus fails (not authenticated)
    mockGetCurrentUser.mockRejectedValue(new Error('Not authenticated'))
    mockFetchAuthSession.mockRejectedValue(new Error('No session'))
  })

  describe('Initial state', () => {
    it('starts with isAuthenticated false and user null', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
    })

    it('starts with error as null', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBeNull()
    })

    it('checks auth status on mount and sets authenticated if user exists', async () => {
      mockGetCurrentUser.mockResolvedValue({
        userId: 'user-123',
        username: 'testuser',
        signInDetails: { loginId: 'test@example.com' },
      })
      mockFetchAuthSession.mockResolvedValue({
        tokens: { idToken: { toString: () => 'mock-token' } },
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual({
        userId: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
      })
    })
  })

  describe('login', () => {
    it('calls signIn then getCurrentUser and sets auth state on success', async () => {
      mockSignIn.mockResolvedValue({ isSignedIn: true })
      mockGetCurrentUser.mockRejectedValueOnce(new Error('Not authenticated'))
      mockGetCurrentUser.mockResolvedValueOnce({
        userId: 'user-456',
        username: 'loginuser',
        signInDetails: { loginId: 'login@example.com' },
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.login('login@example.com', 'password123')
      })

      expect(mockSignIn).toHaveBeenCalledWith({
        username: 'login@example.com',
        password: 'password123',
      })
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual({
        userId: 'user-456',
        email: 'login@example.com',
        username: 'loginuser',
      })
      expect(result.current.error).toBeNull()
    })

    it('sets error message on login failure', async () => {
      mockSignIn.mockRejectedValue(new Error('Invalid credentials'))

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        try {
          await result.current.login('bad@example.com', 'wrong')
        } catch {
          // expected
        }
      })

      expect(result.current.error).toBe('Invalid credentials')
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.isLoading).toBe(false)
    })

    it('sets error when sign up not confirmed', async () => {
      mockSignIn.mockResolvedValue({
        isSignedIn: false,
        nextStep: { signInStep: 'CONFIRM_SIGN_UP' },
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.login('unconfirmed@example.com', 'pass123')
      })

      expect(result.current.error).toBe('Please confirm your email first')
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('register', () => {
    it('calls signUp with correct parameters on success', async () => {
      mockSignUp.mockResolvedValue({ isSignUpComplete: false })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.register('new@example.com', 'Pass1234', 'John Doe')
      })

      expect(mockSignUp).toHaveBeenCalledWith({
        username: 'new@example.com',
        password: 'Pass1234',
        options: {
          userAttributes: {
            email: 'new@example.com',
            name: 'John Doe',
          },
        },
      })
      expect(result.current.error).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })

    it('sets error on register failure', async () => {
      mockSignUp.mockRejectedValue(new Error('User already exists'))

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        try {
          await result.current.register('existing@example.com', 'Pass1234')
        } catch {
          // expected
        }
      })

      expect(result.current.error).toBe('User already exists')
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('confirmRegistration', () => {
    it('calls confirmSignUp with correct parameters on success', async () => {
      mockConfirmSignUp.mockResolvedValue({})

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.confirmRegistration('user@example.com', '123456')
      })

      expect(mockConfirmSignUp).toHaveBeenCalledWith({
        username: 'user@example.com',
        confirmationCode: '123456',
      })
      expect(result.current.error).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('logout', () => {
    it('clears auth state on successful logout', async () => {
      // Start authenticated
      mockGetCurrentUser.mockResolvedValue({
        userId: 'user-123',
        username: 'testuser',
        signInDetails: { loginId: 'test@example.com' },
      })
      mockFetchAuthSession.mockResolvedValue({
        tokens: { idToken: { toString: () => 'mock-token' } },
      })
      mockSignOut.mockResolvedValue(undefined)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true)
      })

      await act(async () => {
        await result.current.logout()
      })

      expect(mockSignOut).toHaveBeenCalled()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
      expect(result.current.error).toBeNull()
    })
  })

  describe('forgotPassword', () => {
    it('calls resetPassword with correct username on success', async () => {
      mockResetPassword.mockResolvedValue({})

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.forgotPassword('forgot@example.com')
      })

      expect(mockResetPassword).toHaveBeenCalledWith({
        username: 'forgot@example.com',
      })
      expect(result.current.error).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('confirmForgotPassword', () => {
    it('calls confirmResetPassword with correct parameters', async () => {
      mockConfirmResetPassword.mockResolvedValue({})

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.confirmForgotPassword('user@example.com', '654321', 'NewPass123')
      })

      expect(mockConfirmResetPassword).toHaveBeenCalledWith({
        username: 'user@example.com',
        confirmationCode: '654321',
        newPassword: 'NewPass123',
      })
      expect(result.current.error).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('clearError', () => {
    it('clears the error state', async () => {
      mockSignIn.mockRejectedValue(new Error('Some error'))

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Trigger an error
      await act(async () => {
        try {
          await result.current.login('bad@example.com', 'wrong')
        } catch {
          // expected
        }
      })

      expect(result.current.error).toBe('Some error')

      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })
  })

  describe('getAccessToken', () => {
    it('returns token from fetchAuthSession', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      mockFetchAuthSession.mockResolvedValue({
        tokens: { idToken: { toString: () => 'my-jwt-token' } },
      })

      let token: string | null = null
      await act(async () => {
        token = await result.current.getAccessToken()
      })

      expect(token).toBe('my-jwt-token')
    })

    it('returns null when fetchAuthSession fails', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      mockFetchAuthSession.mockRejectedValue(new Error('No session'))

      let token: string | null = 'not-null'
      await act(async () => {
        token = await result.current.getAccessToken()
      })

      expect(token).toBeNull()
    })
  })

  describe('useAuth outside AuthProvider', () => {
    it('throws an error when used outside AuthProvider', () => {
      expect(() => {
        renderHook(() => useAuth())
      }).toThrow('useAuth must be used within an AuthProvider')
    })
  })
})
