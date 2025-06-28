import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Box, Text, Center } from '@gluestack-ui/themed';
import { useThemeColors } from 'src/Config/ThemeProvider';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'large', 
  fullScreen = false 
}: LoadingSpinnerProps) {
  const colors = useThemeColors();

  const content = (
    <>
      <ActivityIndicator size={size} color={colors.primary500} />
      {message && (
        <Text marginTop="$4" fontSize="$md" color={colors.textMuted}>
          {message}
        </Text>
      )}
    </>
  );

  if (fullScreen) {
    return (
      <Box flex={1} backgroundColor={colors.backgroundPrimary}>
        <Center flex={1}>
          {content}
        </Center>
      </Box>
    );
  }

  return (
    <Center>
      {content}
    </Center>
  );
} 