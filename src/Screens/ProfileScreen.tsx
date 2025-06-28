import { MaterialIcons } from '@expo/vector-icons';
import { Box, Pressable, Center } from '@gluestack-ui/themed';
import { useTheme, useThemeColors } from 'src/Config/ThemeProvider';

export default function ProfileScreen() {
  const { theme, toggleTheme } = useTheme();
  const colors = useThemeColors();
  
  return (
    <Box flex={1} backgroundColor={colors.backgroundPrimary}>
      <Center flex={1}>
        <Pressable
          backgroundColor={colors.backgroundCard}
          width={80}
          height={80}
          borderRadius={40}
          justifyContent="center"
          alignItems="center"
          shadowColor="#000"
          shadowOffset={{
            width: 0,
            height: 4,
          }}
          shadowOpacity={0.15}
          shadowRadius={8}
          elevation={8}
          onPress={toggleTheme}
          $pressed={{ opacity: 0.7 }}
        >
          <MaterialIcons 
            name={theme.isDark ? 'light-mode' : 'dark-mode'} 
            size={48} 
            color={colors.primary500} 
          />
        </Pressable>
      </Center>
    </Box>
  );
} 