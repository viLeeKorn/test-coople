import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Button, Text } from '@gluestack-ui/themed';
import { useThemeColors } from 'src/Config/ThemeProvider';

interface LoadMoreButtonProps {
  onPress: () => void;
  loading: boolean;
  hasMore: boolean;
  text?: string;
  loadingText?: string;
}

export default function LoadMoreButton({ 
  onPress, 
  loading, 
  hasMore,
  text = 'Load More',
  loadingText = 'Loading...'
}: LoadMoreButtonProps) {
  const colors = useThemeColors();

  if (!hasMore) return null;

  return (
    <Button
      onPress={onPress}
      disabled={loading}
      marginTop="$2"
      marginBottom="$2"
      backgroundColor={colors.backgroundCard}
      borderWidth={1}
      borderColor={colors.borderLight}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.primary500} />
      ) : (
        <Text color={colors.primary600} fontSize="$md" fontWeight="$semibold">
          {text}
        </Text>
      )}
    </Button>
  );
} 