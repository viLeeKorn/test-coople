import { Stack, Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <Stack>
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
          presentation: 'modal'
        }}
      />
    </Stack>
  );
} 