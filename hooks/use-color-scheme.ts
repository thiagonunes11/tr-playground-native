import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { useColorScheme as useSystemColorScheme } from 'react-native';

/**
 * The scheme the app is actually rendering in.
 *
 * NativeWind's `dark:` classes follow its own store, so the navigation theme has
 * to read the same value or the in-app toggle would move one without the other.
 * Falls back to the system scheme while NativeWind is still on 'system'.
 */
export function useColorScheme(): 'light' | 'dark' {
  const { colorScheme } = useNativeWindColorScheme();
  const systemColorScheme = useSystemColorScheme();

  return colorScheme ?? systemColorScheme ?? 'light';
}
