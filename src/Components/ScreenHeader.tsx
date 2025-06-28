import React from 'react';
import { Box, Text, VStack } from '@gluestack-ui/themed';
import { useThemeColors } from 'src/Config/ThemeProvider';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBorder?: boolean;
}

export default function ScreenHeader({ 
  title, 
  subtitle, 
  showBorder = true 
}: ScreenHeaderProps) {
  const colors = useThemeColors();

  return (
    <VStack
      padding="$5"
      paddingTop="$8"
      backgroundColor={colors.backgroundCard}
      borderBottomWidth={showBorder ? 1 : 0}
      borderBottomColor={colors.borderLight}
    >
      <Text fontSize="$3xl" fontWeight="$bold" color={colors.textPrimary} marginBottom="$1">
        {title}
      </Text>
      {subtitle && (
        <Text fontSize="$md" color={colors.textMuted}>
          {subtitle}
        </Text>
      )}
    </VStack>
  );
} 