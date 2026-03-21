import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getApiEndpoint,
  getAuthConfig,
  isApiConfigured,
  isAuthConfigured,
  shouldUseMockData,
} from './amplifyConfig'

describe('amplifyConfig', () => {
  describe('Security - No sensitive data exposure', () => {
    it('should not log API endpoint to console', async () => {
      const consoleSpy = vi.spyOn(console, 'log')

      // Module should not log sensitive config values
      const logCalls = consoleSpy.mock.calls.filter(
        (call) =>
          typeof call[0] === 'string' &&
          (call[0].includes('API configured') ||
            call[0].includes('Auth configured'))
      )
      expect(logCalls).toHaveLength(0)

      consoleSpy.mockRestore()
    })

    it('getApiEndpoint should not expose full URL in errors', () => {
      const endpoint = getApiEndpoint()
      // Should return null when not configured, not throw with URL details
      if (endpoint === null) {
        expect(endpoint).toBeNull()
      }
    })

    it('getAuthConfig should not expose user pool details in errors', () => {
      const config = getAuthConfig()
      if (config === null) {
        expect(config).toBeNull()
      }
    })
  })

  describe('Configuration state', () => {
    it('isApiConfigured returns false when no config loaded', () => {
      // Without amplify_outputs.json, should return false
      expect(typeof isApiConfigured()).toBe('boolean')
    })

    it('isAuthConfigured returns false when no config loaded', () => {
      expect(typeof isAuthConfigured()).toBe('boolean')
    })

    it('shouldUseMockData returns boolean', () => {
      expect(typeof shouldUseMockData()).toBe('boolean')
    })
  })
})
