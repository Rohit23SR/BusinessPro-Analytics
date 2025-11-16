import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNotification } from './useNotification';

describe('useNotification', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with popup hidden', () => {
    const { result } = renderHook(() => useNotification());

    expect(result.current.showPopup).toBe(false);
    expect(result.current.popupMessage).toBe('');
  });

  it('should show notification with message', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.showNotification('Test message');
    });

    expect(result.current.showPopup).toBe(true);
    expect(result.current.popupMessage).toBe('Test message');
  });

  it('should auto-hide notification after 2 seconds', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.showNotification('Auto-hide test');
    });

    expect(result.current.showPopup).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.showPopup).toBe(false);
    // Message remains but popup is hidden
    expect(result.current.popupMessage).toBe('Auto-hide test');
  });

  it('should manually hide notification', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.showNotification('Manual hide test');
    });

    expect(result.current.showPopup).toBe(true);

    act(() => {
      result.current.hideNotification();
    });

    expect(result.current.showPopup).toBe(false);
  });

  it('should clear previous timeout when showing new notification', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.showNotification('First message');
    });

    act(() => {
      vi.advanceTimersByTime(1500); // Halfway through
    });

    act(() => {
      result.current.showNotification('Second message');
    });

    expect(result.current.popupMessage).toBe('Second message');

    act(() => {
      vi.advanceTimersByTime(1500); // Would have hidden first message
    });

    // Should still be showing because timer was reset
    expect(result.current.showPopup).toBe(true);
    expect(result.current.popupMessage).toBe('Second message');

    act(() => {
      vi.advanceTimersByTime(1500); // Now it should hide
    });

    expect(result.current.showPopup).toBe(false);
  });

  it('should handle multiple sequential notifications', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.showNotification('Message 1');
    });

    expect(result.current.popupMessage).toBe('Message 1');

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    act(() => {
      result.current.showNotification('Message 2');
    });

    expect(result.current.popupMessage).toBe('Message 2');
    expect(result.current.showPopup).toBe(true);
  });
});
