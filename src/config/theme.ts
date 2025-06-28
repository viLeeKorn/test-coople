import { colors } from './colors';

export type ThemeMode = 'light' | 'dark';
export interface ColorPalette {
  [key: string]: string;
}

export const darkColors: ColorPalette = {
  primary50: '#1e3a8a', // Dark blue background for salary badges
  primary500: '#3b82f6', // Lighter blue for better contrast in dark mode
  primary600: '#60a5fa', // Even lighter blue for salary text
  secondary50: '#1f2937', // Dark gray background
  secondary100: '#111827', // Very dark background
  secondary200: '#374151', // Dark border color
  secondary300: '#4b5563', // Medium dark border
  secondary400: '#9ca3af', // Light muted text
  secondary500: '#d1d5db', // Light secondary text
  secondary600: '#e5e7eb', // Light primary text
  secondary700: '#f3f4f6', // Very light text
  secondary800: '#f9fafb', // Almost white text
  accentPink: '#ec4899', // Lighter pink for better contrast
  accentRed: '#ef4444', // Lighter red for better contrast
  accentWhite: '#1f2937', // Dark background instead of white
  accentBlack: '#f9fafb', // Light text instead of black
  backgroundPrimary: '#111827', // Very dark background
  backgroundSecondary: '#1f2937', // Dark secondary background
  backgroundCard: '#1f2937', // Dark card backgrounds
  backgroundSplash: '#000000', // Black splash screen
  textPrimary: '#f9fafb', // Light text
  textSecondary: '#e5e7eb', // Light secondary text
  textMuted: '#d1d5db', // Light muted text
  textLight: '#9ca3af', // Medium light text
  textWhite: '#111827', // Dark background instead of white text
  borderLight: '#374151', // Dark borders
  borderMedium: '#4b5563', // Medium dark borders
  shadowPrimary: '#000000', // Black shadows
  gluestackTextDark400: '#9CA3AF', // Muted text
  gluestackTextDark500: '#D1D5DB', // Secondary text
  gluestackTextDark700: '#E5E7EB', // Primary text
  gluestackTextDark900: '#F9FAFB', // Dark text (inverted)
  gluestackGray50: '#111827', // Dark background
  gluestackGray200: '#374151', // Dark border color
  gluestackBlue50: '#1e3a8a', // Dark blue background
  gluestackBlue600: '#60a5fa', // Light blue text
  gluestackRed50: '#7f1d1d', // Dark red background
  gluestackRed600: '#f87171', // Light red text
};

export const lightColors: ColorPalette = {
  primary50: colors.primary[50],
  primary500: colors.primary[500],
  primary600: colors.primary[600],
  secondary50: colors.secondary[50],
  secondary100: colors.secondary[100],
  secondary200: colors.secondary[200],
  secondary300: colors.secondary[300],
  secondary400: colors.secondary[400],
  secondary500: colors.secondary[500],
  secondary600: colors.secondary[600],
  secondary700: colors.secondary[700],
  secondary800: colors.secondary[800],
  accentPink: colors.accent.pink,
  accentRed: colors.accent.red,
  accentWhite: colors.accent.white,
  accentBlack: colors.accent.black,
  backgroundPrimary: colors.background.primary,
  backgroundSecondary: colors.background.secondary,
  backgroundCard: colors.background.card,
  backgroundSplash: colors.background.splash,
  textPrimary: colors.text.primary,
  textSecondary: colors.text.secondary,
  textMuted: colors.text.muted,
  textLight: colors.text.light,
  textWhite: colors.text.white,
  borderLight: colors.border.light,
  borderMedium: colors.border.medium,
  shadowPrimary: colors.shadow.primary,
  gluestackTextDark400: colors.gluestack.textDark[400],
  gluestackTextDark500: colors.gluestack.textDark[500],
  gluestackTextDark700: colors.gluestack.textDark[700],
  gluestackTextDark900: colors.gluestack.textDark[900],
  gluestackGray50: colors.gluestack.gray[50],
  gluestackGray200: colors.gluestack.gray[200],
  gluestackBlue50: colors.gluestack.blue[50],
  gluestackBlue600: colors.gluestack.blue[600],
  gluestackRed50: colors.gluestack.red[50],
  gluestackRed600: colors.gluestack.red[600],
};

export interface ThemeConfig {
  mode: ThemeMode;
  colors: ColorPalette;
  isDark: boolean;
}

export interface ThemeContextType {
  theme: ThemeConfig;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const defaultTheme: ThemeConfig = {
  mode: 'light',
  colors: lightColors,
  isDark: false,
};

export const getThemeColors = (mode: ThemeMode): ColorPalette => {
  return mode === 'dark' ? darkColors : lightColors;
};

export const createTheme = (mode: ThemeMode): ThemeConfig => ({
  mode,
  colors: getThemeColors(mode),
  isDark: mode === 'dark',
});

export const getColor = (theme: ThemeConfig, colorKey: string): string => {
  return theme.colors[colorKey] || '#000000';
};

export const getBackgroundColor = (theme: ThemeConfig, variant: 'primary' | 'secondary' | 'card' | 'splash' = 'primary') => {
  const key = `background${variant.charAt(0).toUpperCase() + variant.slice(1)}`;
  return theme.colors[key] || '#000000';
};

export const getTextColor = (theme: ThemeConfig, variant: 'primary' | 'secondary' | 'muted' | 'light' | 'white' = 'primary') => {
  const key = `text${variant.charAt(0).toUpperCase() + variant.slice(1)}`;
  return theme.colors[key] || '#000000';
};

export const getPrimaryColor = (theme: ThemeConfig, shade: 50 | 500 | 600 = 500) => {
  const key = `primary${shade}`;
  return theme.colors[key] || '#000000';
};

export const getAccentColor = (theme: ThemeConfig, variant: 'pink' | 'red' | 'white' | 'black') => {
  const key = `accent${variant.charAt(0).toUpperCase() + variant.slice(1)}`;
  return theme.colors[key] || '#000000';
};

export const getGluestackThemeTokens = (theme: ThemeConfig) => {
  return {
    textDark900: theme.colors.gluestackTextDark900 || '#262626',
    textDark700: theme.colors.gluestackTextDark700 || '#525252',
    textDark500: theme.colors.gluestackTextDark500 || '#8C8C8C',
    textDark400: theme.colors.gluestackTextDark400 || '#A3A3A3',
    gray50: theme.colors.gluestackGray50 || '#F9FAFB',
    gray200: theme.colors.gluestackGray200 || '#E5E7EB',
    blue50: theme.colors.gluestackBlue50 || '#EFF6FF',
    blue600: theme.colors.gluestackBlue600 || '#2563EB',
    red50: theme.colors.gluestackRed50 || '#FEF2F2',
    red600: theme.colors.gluestackRed600 || '#DC2626',
    white: theme.isDark ? theme.colors.backgroundPrimary : '#FFFFFF',
  };
};

export const themes = {
  light: lightColors,
  dark: darkColors,
} as const; 