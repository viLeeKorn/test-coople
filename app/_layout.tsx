import { Stack } from 'expo-router';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { ThemeProvider, useThemeColors } from 'src/Config/ThemeProvider';
import QueryProvider from 'src/Config/QueryProvider';
import { Box } from '@gluestack-ui/themed';

function StackNavigator() {
  const colors = useThemeColors();

  return (
    <Box flex={1} backgroundColor={colors.backgroundPrimary}>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: colors.backgroundPrimary,
          },
          headerStyle: {
            backgroundColor: colors.backgroundCard,
          },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            color: colors.textPrimary,
          },
          animation: 'slide_from_right',
          animationDuration: 200,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="job/[id]"
          options={{
            headerShown: true,
            title: 'Job Details',
            headerBackTitle: 'Back',
            presentation: 'modal',
            headerStyle: {
              backgroundColor: colors.backgroundCard,
            },
            headerTintColor: colors.textPrimary,
            headerTitleStyle: {
              color: colors.textPrimary,
            },
          }}
        />
      </Stack>
    </Box>
  );
}

export default function RootLayout() {
  return (
    <QueryProvider>
      <ThemeProvider initialTheme="light">
        <GluestackUIProvider config={config}>
          <StackNavigator />
        </GluestackUIProvider>
      </ThemeProvider>
    </QueryProvider>
  );
} 