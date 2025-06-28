import React from 'react';
import { Box, Text, Center, Button } from '@gluestack-ui/themed';
import { useThemeColors } from 'src/Config/ThemeProvider';

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
  fullScreen?: boolean;
}

export default function ErrorView({ 
  message, 
  onRetry, 
  retryText = 'Retry',
  fullScreen = false 
}: ErrorViewProps) {
  const colors = useThemeColors();

  const content = (
    <>
      <Text fontSize="$md" color={colors.accentRed} textAlign="center" marginBottom="$4">
        {message}
      </Text>
      {onRetry && (
        <Button onPress={onRetry} backgroundColor={colors.primary500}>
          <Text color={colors.textWhite} fontSize="$md" fontWeight="$semibold">
            {retryText}
          </Text>
        </Button>
      )}
    </>
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