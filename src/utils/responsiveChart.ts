// Responsive chart utilities
import { BREAKPOINT_SM, BREAKPOINT_MD, BREAKPOINT_LG } from '../constants/appConstants'

export const getResponsiveChartHeight = (baseHeight: number): number => {
  if (typeof window === 'undefined') return baseHeight

  const width = window.innerWidth
  if (width < BREAKPOINT_SM) return Math.min(baseHeight * 0.7, 300) // sm
  if (width < BREAKPOINT_MD) return Math.min(baseHeight * 0.85, 350) // md
  return baseHeight
}

export const getResponsiveChartMargins = () => {
  if (typeof window === 'undefined') {
    return { top: 30, right: 80, bottom: 60, left: 70 }
  }

  const width = window.innerWidth
  if (width < BREAKPOINT_SM) {
    return { top: 20, right: 15, bottom: 50, left: 50 }
  }
  if (width < BREAKPOINT_MD) {
    return { top: 25, right: 40, bottom: 55, left: 60 }
  }
  return { top: 30, right: 80, bottom: 60, left: 70 }
}

export const getResponsiveHeatmapWidth = (): number => {
  if (typeof window === 'undefined') return 800

  const width = window.innerWidth
  if (width < BREAKPOINT_SM) return Math.min(width - 80, 500)
  if (width < BREAKPOINT_MD) return 600
  if (width < BREAKPOINT_LG) return 700
  return 800
}

export const getResponsivePieChartSize = (baseWidth: number, baseHeight: number) => {
  if (typeof window === 'undefined') return { width: baseWidth, height: baseHeight }

  const width = window.innerWidth
  if (width < BREAKPOINT_SM) {
    return {
      width: Math.min(baseWidth * 0.85, 250),
      height: Math.min(baseHeight * 0.85, 180),
    }
  }
  return { width: baseWidth, height: baseHeight }
}
