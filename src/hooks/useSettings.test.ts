import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'

// Mock amplifyConfig — backend NOT configured (local mode)
vi.mock('../utils/amplifyConfig', () => ({
  isApiConfigured: () => false,
}))

// Mock the API client so it never gets called
vi.mock('../services/apiClient', () => ({
  settingsApiClient: {
    getPreferences: vi.fn(),
    updatePreferences: vi.fn(),
    getDashboardConfig: vi.fn(),
    updateDashboardConfig: vi.fn(),
    getNotifications: vi.fn(),
    updateNotifications: vi.fn(),
  },
}))

import { useSettings } from './useSettings'

// Provide a working localStorage mock (jsdom may not have one)
const localStorageStore: Record<string, string> = {}
const localStorageMock = {
  getItem(key: string) {
    return localStorageStore[key] ?? null
  },
  setItem(key: string, value: string) {
    localStorageStore[key] = value
  },
  removeItem(key: string) {
    delete localStorageStore[key]
  },
  clear() {
    Object.keys(localStorageStore).forEach((key) => delete localStorageStore[key])
  },
  get length() {
    return Object.keys(localStorageStore).length
  },
  key(index: number) {
    return Object.keys(localStorageStore)[index] ?? null
  },
}

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useSettings (local mode — no backend)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    document.documentElement.classList.remove('dark')
  })

  it('returns default settings on init', () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(),
    })

    expect(result.current.settings.theme).toBe('light')
    expect(result.current.settings.language).toBe('en')
    expect(result.current.settings.timezone).toBe('UTC')
    expect(result.current.settings.currency).toBe('USD')
    expect(result.current.settings.analytics).toBe(true)
    expect(result.current.settings.marketing).toBe(false)
    expect(result.current.settings.sharing).toBe(false)
    expect(result.current.settings.layout).toBe('grid')
    expect(result.current.settings.timeframe).toBe('30d')
    expect(result.current.settings.autoRefresh).toBe(true)
    expect(result.current.settings.apiKey).toBe('sk_live_abc123...xyz789')
  })

  it('returns default integrations on init', () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(),
    })

    expect(result.current.integrations).toHaveLength(6)
    expect(result.current.integrations[0].name).toBe('Google Analytics')
    expect(result.current.integrations[0].connected).toBe(true)
    expect(result.current.integrations[1].name).toBe('Stripe')
    expect(result.current.integrations[1].connected).toBe(true)
    expect(result.current.integrations[2].name).toBe('Salesforce')
    expect(result.current.integrations[2].connected).toBe(false)
  })

  it('updateSetting updates a single value', () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.updateSetting('language', 'es')
    })

    expect(result.current.settings.language).toBe('es')
    // Other settings remain unchanged
    expect(result.current.settings.theme).toBe('light')
    expect(result.current.settings.currency).toBe('USD')
  })

  it('updateSetting for theme updates DOM class and localStorage', () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.updateSetting('theme', 'dark')
    })

    expect(result.current.settings.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')

    // Switch back to light
    act(() => {
      result.current.updateSetting('theme', 'light')
    })

    expect(result.current.settings.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('resetSettings restores defaults', () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(),
    })

    // Change several settings (separate act calls so each sees updated state)
    act(() => {
      result.current.updateSetting('theme', 'dark')
    })
    act(() => {
      result.current.updateSetting('language', 'fr')
    })
    act(() => {
      result.current.updateSetting('currency', 'EUR')
    })
    act(() => {
      result.current.updateSetting('autoRefresh', false)
    })

    expect(result.current.settings.theme).toBe('dark')
    expect(result.current.settings.language).toBe('fr')

    act(() => {
      result.current.resetSettings()
    })

    expect(result.current.settings.theme).toBe('light')
    expect(result.current.settings.language).toBe('en')
    expect(result.current.settings.currency).toBe('USD')
    expect(result.current.settings.autoRefresh).toBe(true)
  })

  it('toggleIntegration flips connected state', () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(),
    })

    // Salesforce starts disconnected
    expect(result.current.integrations.find((i) => i.name === 'Salesforce')?.connected).toBe(false)

    act(() => {
      result.current.toggleIntegration('Salesforce')
    })

    expect(result.current.integrations.find((i) => i.name === 'Salesforce')?.connected).toBe(true)

    // Toggle it back
    act(() => {
      result.current.toggleIntegration('Salesforce')
    })

    expect(result.current.integrations.find((i) => i.name === 'Salesforce')?.connected).toBe(false)
  })

  it('toggleIntegration does not affect other integrations', () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(),
    })

    const stripeBefore = result.current.integrations.find((i) => i.name === 'Stripe')?.connected

    act(() => {
      result.current.toggleIntegration('Salesforce')
    })

    const stripeAfter = result.current.integrations.find((i) => i.name === 'Stripe')?.connected
    expect(stripeAfter).toBe(stripeBefore)
  })

  it('generateApiKey produces new key with sk_live_ prefix', () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(),
    })

    const originalKey = result.current.settings.apiKey

    act(() => {
      result.current.generateApiKey()
    })

    expect(result.current.settings.apiKey).not.toBe(originalKey)
    expect(result.current.settings.apiKey.startsWith('sk_live_')).toBe(true)
  })

  it('generateApiKey produces different keys on each call', () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.generateApiKey()
    })
    const key1 = result.current.settings.apiKey

    act(() => {
      result.current.generateApiKey()
    })
    const key2 = result.current.settings.apiKey

    expect(key1).not.toBe(key2)
    expect(key1.startsWith('sk_live_')).toBe(true)
    expect(key2.startsWith('sk_live_')).toBe(true)
  })

  it('isLoading is false when backend not configured', () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(false)
  })

  it('isSaving is false when backend not configured', () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isSaving).toBe(false)

    // Even after updating a setting, isSaving stays false in local mode
    act(() => {
      result.current.updateSetting('language', 'de')
    })

    expect(result.current.isSaving).toBe(false)
  })

  it('isError is false when backend not configured', () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isError).toBe(false)
  })

  it('saveError is null when backend not configured', () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(),
    })

    expect(result.current.saveError).toBeNull()
  })
})
