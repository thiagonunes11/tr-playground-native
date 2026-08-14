import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

import { DEMOS } from '@/constants/demos';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />

          {/* Derived from DEMOS so a new demo only has to be registered once */}
          {DEMOS.map((demo) => (
            <Stack.Screen
              key={demo.id}
              name={demo.route.replace(/^\//, '')}
              options={{ headerShown: true, title: demo.title }}
            />
          ))}

          {/* Reachable only through a deep link, so it is intentionally absent from DEMOS */}
          <Stack.Screen
            name="demos/deep-link"
            options={{ headerShown: true, title: 'Deep Links' }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
