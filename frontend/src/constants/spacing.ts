export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 48,
  xl: 80,
  "2xl": 120,
} as const;

export const sectionPadding = {
  mobile: spacing.lg,
  tablet: spacing.xl,
  desktop: spacing["2xl"],
} as const;

export const containerMaxWidth = 1280;
