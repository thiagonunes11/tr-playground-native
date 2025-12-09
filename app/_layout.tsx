import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="demos/button-tap" options={{ headerShown: true, title: 'Button Tap' }} />
        <Stack.Screen name="demos/camera-validation" options={{ headerShown: true, title: 'Camera Validation' }} />
        <Stack.Screen name="demos/checkbox-interaction" options={{ headerShown: true, title: 'Checkbox Interaction' }} />
        <Stack.Screen name="demos/audio-validation" options={{ headerShown: true, title: 'Audio Validation' }} />
        <Stack.Screen name="demos/delete-elements" options={{ headerShown: true, title: 'Delete Elements' }} />
        <Stack.Screen name="demos/date-picker" options={{ headerShown: true, title: 'Date Picker' }} />
        <Stack.Screen name="demos/dynamic-login" options={{ headerShown: true, title: 'Dynamic Login Text' }} />
        <Stack.Screen name="demos/swipe-horizontal" options={{ headerShown: true, title: 'Swipe Horizontal' }} />
        <Stack.Screen name="demos/swipe-vertical" options={{ headerShown: true, title: 'Swipe Vertical' }} />
        <Stack.Screen name="demos/counter" options={{ headerShown: true, title: 'Counter' }} />
        <Stack.Screen name="demos/api-validation" options={{ headerShown: true, title: 'API Validation' }} />
        <Stack.Screen name="demos/shopping-cart" options={{ headerShown: true, title: 'Shopping Cart' }} />
        <Stack.Screen name="demos/file-download" options={{ headerShown: true, title: 'File Download' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
