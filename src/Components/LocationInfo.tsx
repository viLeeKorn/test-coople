import React from 'react';
import { Text, VStack } from '@gluestack-ui/themed';
import { useThemeColors } from 'src/Config/ThemeProvider';

interface JobLocation {
  city: string;
  zip: string;
  state?: string;
}

interface LocationInfoProps {
  location: JobLocation;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function LocationInfo({ 
  location, 
  showIcon = true,
  size = 'md'
}: LocationInfoProps) {
  const colors = useThemeColors();

  const fontSizeMap = {
    sm: '$sm',
    md: '$md',
    lg: '$lg'
  };

  const iconSizeMap = {
    sm: '$xs',
    md: '$sm',
    lg: '$md'
  };

  return (
    <VStack space="xs">
      <Text fontSize={fontSizeMap[size]} color={colors.textSecondary}>
        {showIcon ? '📍 ' : ''}{location.city}, {location.zip}
      </Text>
      {location.state && (
        <Text fontSize={iconSizeMap[size]} color={colors.textMuted}>
          {location.state}
        </Text>
      )}
    </VStack>
  );
} 