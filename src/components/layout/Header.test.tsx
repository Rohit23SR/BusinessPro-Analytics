import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'
import { routes } from '../../router/index'

// Mock useAuth hook
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { userId: '123', email: 'admin@example.com', username: 'admin' },
    isAuthenticated: true,
    isLoading: false,
    error: null,
    logout: vi.fn().mockResolvedValue(undefined),
    clearError: vi.fn(),
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

const renderHeader = (props: { onMenuClick?: () => void } = {}) => {
  const defaultProps = {
    onMenuClick: vi.fn(),
    currentRoute: routes.dashboard,
    ...props,
  }
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Header {...defaultProps} />
    </MemoryRouter>
  )
}

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders mobile menu button', () => {
    renderHeader()
    // The menu button is the first button in the left section
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(1)
    // The first button should be the mobile menu toggle
    const menuButton = buttons[0]
    expect(menuButton).toBeInTheDocument()
  })

  it('renders search input', () => {
    renderHeader()
    const searchInput = screen.getByPlaceholderText(/search dashboards, reports/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('renders notification bell icon button', () => {
    renderHeader()
    // There are multiple buttons; the notification button has an unread badge
    // The unread count badge is rendered when there are unread notifications
    const badge = screen.getByText('2')
    expect(badge).toBeInTheDocument()
  })

  it('renders user avatar/menu button', () => {
    renderHeader()
    // The user menu button contains the initials "RS"
    const avatar = screen.getByText('RS')
    expect(avatar).toBeInTheDocument()
  })

  it('calls onMenuClick when menu button clicked', () => {
    const mockOnMenuClick = vi.fn()
    renderHeader({ onMenuClick: mockOnMenuClick })

    // The mobile menu button is the first button rendered
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(mockOnMenuClick).toHaveBeenCalledOnce()
  })

  it('renders breadcrumb for dashboard', () => {
    renderHeader()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders timeframe selector', () => {
    renderHeader()
    const select = screen.getByDisplayValue('Last 30 days')
    expect(select).toBeInTheDocument()
  })

  it('opens user menu on avatar click', () => {
    renderHeader()
    const avatar = screen.getByText('RS')
    const avatarButton = avatar.closest('button')!
    fireEvent.click(avatarButton)

    // The dropdown should show user info and settings items
    expect(screen.getByText('Sign out')).toBeInTheDocument()
  })
})
