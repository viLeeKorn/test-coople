import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ThemeConfig, 
  ThemeContextType, 
  ThemeMode, 
  createTheme, 
} from './theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@coople_theme_mode';

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = 'light' 
}) => {
  const [theme, setThemeState] = useState<ThemeConfig>(() => 
    createTheme(initialTheme)
  );

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setThemeState(createTheme(savedTheme));
      }
    } catch (error) {
      console.warn('Failed to load saved theme:', error);
    }
  };

  const saveTheme = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Failed to save theme:', error);
    }
  };

  const setTheme = (mode: ThemeMode) => {
    const newTheme = createTheme(mode);
    setThemeState(newTheme);
    saveTheme(mode);
  };

  const toggleTheme = () => {
    const newMode = theme.mode === 'light' ? 'dark' : 'light';
    setTheme(newMode);
  };

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useThemeColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

export const useIsDarkMode = () => {
  const { theme } = useTheme();
  return theme.isDark;
};

export default ThemeProvider; 