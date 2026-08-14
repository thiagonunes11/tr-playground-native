import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ThemeToggleProps {
  /** Show the target scheme next to the icon. Off in the compact stack header. */
  showLabel?: boolean;
}

export function ThemeToggle({ showLabel = false }: ThemeToggleProps) {
  const colorScheme = useColorScheme();
  const { setColorScheme } = useNativeWindColorScheme();
  const isDark = colorScheme === 'dark';

  // Set the target scheme explicitly rather than using toggleColorScheme(), so the
  // button always flips to whatever the icon is showing even on the first tap,
  // while NativeWind is still resolving 'system'.
  const handlePress = () => {
    setColorScheme(isDark ? 'light' : 'dark');
  };

  return (
    <Pressable
      testID="theme-toggle-button"
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      // Exposes the scheme in effect to automation without rendering anything extra
      accessibilityValue={{ text: colorScheme }}
      onPress={handlePress}
      className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-2 active:bg-gray-200 dark:active:bg-gray-600"
    >
      <Ionicons
        name={isDark ? 'sunny-outline' : 'moon-outline'}
        size={18}
        color={isDark ? '#FBBF24' : '#4B5563'}
      />

      {showLabel && (
        <Text
          testID="theme-toggle-label"
          className="text-xs font-semibold text-gray-700 dark:text-gray-200 ml-2"
        >
          {isDark ? 'Light' : 'Dark'}
        </Text>
      )}
    </Pressable>
  );
}
