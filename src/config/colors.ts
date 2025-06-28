export const primary = {
  50: '#e3f2fd', // Light blue background for salary badges
  500: '#007AFF', // iOS blue - main action color, buttons, links
  600: '#1976d2', // Darker blue for salary text
} as const;

export const secondary = {
  50: '#f8f9fa', // Light gray background
  100: '#f5f5f5', // Profile screen background
  200: '#e9ecef', // Border color
  300: '#dee2e6', // Light border
  400: '#868e96', // Muted text
  500: '#6c757d', // Secondary text, icons
  600: '#495057', // Primary text
  700: '#212529', // Dark text
  800: '#1a1a1a', // Very dark text
} as const;

export const accent = {
  pink: '#e91e63', // Favorite heart color
  red: '#dc3545', // Error color, delete button
  white: '#fff', // White background for cards
  black: '#000', // Shadow color
} as const;

// Semantic Colors
export const semantic = {
  success: {
    50: '#d4edda',
    500: '#28a745',
    600: '#1e7e34',
  },
  error: {
    50: '#f8d7da',
    500: '#dc3545',
    600: '#c82333',
  },
  warning: {
    50: '#fff3cd',
    500: '#ffc107',
    600: '#e0a800',
  },
} as const;

export const background = {
  primary: '#f8f9fa', // Main app background
  secondary: '#f5f5f5', // Profile screen background
  card: '#fff', // Card backgrounds
  splash: '#ffffff', // Splash screen background
} as const;

export const text = {
  primary: '#1a1a1a', // Main text color
  secondary: '#495057', // Secondary text
  muted: '#6c757d', // Muted text
  light: '#868e96', // Very light text
  white: '#fff', // White text on dark backgrounds
} as const;

export const border = {
  light: '#e9ecef', // Light borders
  medium: '#dee2e6', // Medium borders
} as const;

export const shadow = {
  primary: '#000', // Main shadow color
} as const;

export const gluestackColors = {
  textDark: {
    400: '#A3A3A3', // Muted text
    500: '#8C8C8C', // Secondary text
    700: '#525252', // Primary text
    900: '#262626', // Dark text
  },
  gray: {
    50: '#F9FAFB', // Light background
    200: '#E5E7EB', // Border color
  },
  blue: {
    50: '#EFF6FF', // Light blue background
    600: '#2563EB', // Blue text
  },
  red: {
    50: '#FEF2F2', // Light red background
    600: '#DC2626', // Red text
  },
} as const;

export const legacy = {
  // Colors that might be used in older components
  loadingBlue: '#007AFF',
  favoritePink: '#e91e63',
  favoriteGray: '#6c757d',
  errorRed: '#dc3545',
  salaryBlue: '#1976d2',
  salaryBgBlue: '#e3f2fd',
} as const;

export const colors = {
  primary,
  secondary,
  accent,
  semantic,
  background,
  text,
  border,
  shadow,
  gluestack: gluestackColors,
  legacy,
} as const;

export type ColorPalette = typeof colors;
export type PrimaryColors = typeof primary;
export type SecondaryColors = typeof secondary;
export type AccentColors = typeof accent; 