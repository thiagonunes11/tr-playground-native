import { useEffect, useState } from 'react';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { useColorScheme as useSystemColorScheme } from 'react-native';

/**
 * Web counterpart of use-color-scheme.ts. Static rendering has no scheme to read
 * at build time, so the value has to be recalculated after hydration.
 */
export function useColorScheme(): 'light' | 'dark' {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const { colorScheme } = useNativeWindColorScheme();
  const systemColorScheme = useSystemColorScheme();

  if (hasHydrated) {
    return colorScheme ?? systemColorScheme ?? 'light';
  }

  return 'light';
}
