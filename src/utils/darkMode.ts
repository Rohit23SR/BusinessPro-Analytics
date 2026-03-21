// Dark mode utility functions for D3 charts

/**
 * Detect if dark mode is currently active
 */
export const isDarkMode = (): boolean => {
  return document.documentElement.classList.contains('dark')
}

/**
 * Get chart colors based on current theme
 */
export const getChartColors = () => {
  const dark = isDarkMode()

  return {
    // Text colors
    text: dark ? '#e5e7eb' : '#333',
    textMuted: dark ? '#9ca3af' : '#666',

    // Grid and axis colors
    grid: dark ? '#374151' : '#f0f0f0',
    axis: dark ? '#6b7280' : '#666',

    // Tooltip colors
    tooltipBg: dark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(0, 0, 0, 0.9)',
    tooltipText: dark ? '#ffffff' : '#ffffff',
    tooltipBorder: dark ? '#4b5563' : '#e5e7eb',

    // Background colors
    cardBg: dark ? '#1f2937' : '#ffffff',
  }
}

/**
 * Watch for theme changes and re-render callback
 */
export const watchThemeChange = (callback: () => void): (() => void) => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        callback()
      }
    })
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  return () => observer.disconnect()
}
