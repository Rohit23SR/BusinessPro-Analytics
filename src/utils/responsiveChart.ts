// Responsive chart utilities
export const getResponsiveChartHeight = (baseHeight: number): number => {
  if (typeof window === 'undefined') return baseHeight;

  const width = window.innerWidth;
  if (width < 640) return Math.min(baseHeight * 0.7, 300); // sm
  if (width < 768) return Math.min(baseHeight * 0.85, 350); // md
  return baseHeight;
};

export const getResponsiveChartMargins = () => {
  if (typeof window === 'undefined') {
    return { top: 30, right: 80, bottom: 60, left: 70 };
  }

  const width = window.innerWidth;
  if (width < 640) {
    return { top: 20, right: 15, bottom: 50, left: 50 };
  }
  if (width < 768) {
    return { top: 25, right: 40, bottom: 55, left: 60 };
  }
  return { top: 30, right: 80, bottom: 60, left: 70 };
};

export const getResponsiveHeatmapWidth = (): number => {
  if (typeof window === 'undefined') return 800;

  const width = window.innerWidth;
  if (width < 640) return Math.min(width - 80, 500);
  if (width < 768) return 600;
  if (width < 1024) return 700;
  return 800;
};

export const getResponsivePieChartSize = (baseWidth: number, baseHeight: number) => {
  if (typeof window === 'undefined') return { width: baseWidth, height: baseHeight };

  const width = window.innerWidth;
  if (width < 640) {
    return {
      width: Math.min(baseWidth * 0.85, 250),
      height: Math.min(baseHeight * 0.85, 180)
    };
  }
  return { width: baseWidth, height: baseHeight };
};
