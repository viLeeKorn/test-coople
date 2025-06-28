import React from 'react';
import { Box, Text } from '@gluestack-ui/themed';
import { useThemeColors } from 'src/Config/ThemeProvider';

interface WageBadgeProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  currency?: string;
}

export default function WageBadge({ 
  amount, 
  size = 'sm',
  currency = 'CHF'
}: WageBadgeProps) {
  const colors = useThemeColors();

  const fontSizeMap = {
    sm: '$sm',
    md: '$md',
    lg: '$lg'
  };

  const paddingMap = {
    sm: { horizontal: '$2', vertical: '$1' },
    md: { horizontal: '$3', vertical: '$1.5' },
    lg: { horizontal: '$4', vertical: '$2' }
  };

  return (
    <Box
      backgroundColor={colors.primary50}
      paddingHorizontal={paddingMap[size].horizontal}
      paddingVertical={paddingMap[size].vertical}
      borderRadius="md"
    >
      <Text 
        fontSize={fontSizeMap[size]} 
        fontWeight="$semibold" 
        color={colors.primary600}
      >
        {currency} {amount.toFixed(2)}/h
      </Text>
    </Box>
  );
} 