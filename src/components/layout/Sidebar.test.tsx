import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Sidebar from './Sidebar'

// Mutable user ref that the mock reads
let mockUser: { userId: string; email: string; username: string } | null = {
  userId: '123',
  email: 'john.doe@example.com',
  username: 'johndoe',
}

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: !!mockUser,
    isLoading: false,
    error: null,
  }),
}))

const renderSidebar = (props: { isOpen?: boolean; onClose?: () => void } = {}) => {
  const defaultProps = {
    isOpen: false,
    onClose: vi.fn(),
    ...props,
  }
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Sidebar {...defaultProps} />
    </MemoryRouter>
  )
}

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUser = {
      userId: '123',
      email: 'john.doe@example.com',
      username: 'johndoe',
    }
  })

  it('renders logo and brand text', () => {
    renderSidebar()
    const brandTexts = screen.getAllByText('BusinessPro')
    expect(brandTexts.length).toBeGreaterThanOrEqual(1)
  })

  it('renders all main nav items', () => {
    renderSidebar()
    // The sidebar renders both desktop and mobile nav, so each item appears at least once
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Analytics').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Revenue').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Customers').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Products').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Settings').length).toBeGreaterThanOrEqual(1)
  })

  it('displays user initials from email', () => {
    renderSidebar()
    // "john.doe@example.com" -> first two chars of "john.doe" -> "JO"
    const initials = screen.getAllByText('JO')
    expect(initials.length).toBeGreaterThanOrEqual(1)
  })

  it('displays user display name (email prefix, capitalized)', () => {
    renderSidebar()
    // "john.doe@example.com" -> "john.doe" -> capitalize first letter -> "John.doe"
    const displayNames = screen.getAllByText('John.doe')
    expect(displayNames.length).toBeGreaterThanOrEqual(1)
  })

  it('shows default "User" when no user is logged in', () => {
    mockUser = null

    renderSidebar()

    // With no user, display name should be "User" and initials should be "U"
    const userTexts = screen.getAllByText('User')
    expect(userTexts.length).toBeGreaterThanOrEqual(1)

    const initials = screen.getAllByText('U')
    expect(initials.length).toBeGreaterThanOrEqual(1)
  })

  it('calls onClose callback when overlay clicked (mobile)', () => {
    const mockOnClose = vi.fn()
    renderSidebar({ isOpen: true, onClose: mockOnClose })

    // Clicking the overlay triggers onClose
    const overlay = document.querySelector('.fixed.inset-0.z-40')
    expect(overlay).toBeInTheDocument()
    fireEvent.click(overlay!)
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('renders overlay when sidebar is open on mobile', () => {
    renderSidebar({ isOpen: true })
    const overlay = document.querySelector('.fixed.inset-0.z-40')
    expect(overlay).toBeInTheDocument()
  })

  it('does not render overlay when sidebar is closed', () => {
    renderSidebar({ isOpen: false })
    const overlay = document.querySelector('.fixed.inset-0.z-40')
    expect(overlay).not.toBeInTheDocument()
  })
})
