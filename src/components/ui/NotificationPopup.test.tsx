import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NotificationPopup from './NotificationPopup';

describe('NotificationPopup', () => {
  it('should not render when show is false', () => {
    const { container } = render(
      <NotificationPopup show={false} message="Test" onClose={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render when show is true', () => {
    render(
      <NotificationPopup show={true} message="Success!" onClose={vi.fn()} />
    );

    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('should display the message', () => {
    render(
      <NotificationPopup
        show={true}
        message="Settings saved successfully"
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText('Settings saved successfully')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const mockOnClose = vi.fn();

    render(
      <NotificationPopup show={true} message="Test" onClose={mockOnClose} />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it('should have fixed positioning', () => {
    const { container } = render(
      <NotificationPopup show={true} message="Test" onClose={vi.fn()} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ position: 'fixed' });
  });

  it('should have high z-index for visibility', () => {
    const { container } = render(
      <NotificationPopup show={true} message="Test" onClose={vi.fn()} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ zIndex: 9999 });
  });

  it('should render check icon', () => {
    render(
      <NotificationPopup show={true} message="Test" onClose={vi.fn()} />
    );

    // Check for SVG icon (CheckCircle from lucide-react)
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should handle long messages with truncation', () => {
    const longMessage =
      'This is a very long message that might need to be truncated to fit properly in the notification popup';

    render(
      <NotificationPopup show={true} message={longMessage} onClose={vi.fn()} />
    );

    expect(screen.getByText(longMessage)).toBeInTheDocument();
    expect(screen.getByText(longMessage)).toHaveClass('truncate');
  });
});
