import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Box, Text, Center, VStack } from '@gluestack-ui/themed';
import { useThemeColors } from 'src/Config/ThemeProvider';

interface EmptyStateViewProps {
  title: string;
  message?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  fullScreen?: boolean;
}

export default function EmptyStateView({ 
  title, 
  message, 
  icon = 'inbox',
  fullScreen = false 
}: EmptyStateViewProps) {
  const colors = useThemeColors();

  const content = (
    <VStack alignItems="center" space="md">
      <MaterialIcons 
        name={icon} 
        size={64} 
        color={colors.textMuted} 
      />
      <Text fontSize="$lg" fontWeight="$semibold" color={colors.textPrimary} textAlign="center">
        {title}
      </Text>
      {message && (
        <Text fontSize="$md" color={colors.textMuted} textAlign="center">
          {message}
        </Text>
      )}
    </VStack>
  );

  if (fullScreen) {
    return (
      <Box flex={1} backgroundColor={colors.backgroundPrimary}>
        <Center flex={1} padding="$5">
          {content}
        </Center>
      </Box>
    );
  }

  return (
    <Center padding="$5">
      {content}
    </Center>
  );
} 