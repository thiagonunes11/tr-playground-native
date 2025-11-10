# Developer Documentation: Adding Demo Pages

## Overview

This guide explains how to add new interactive demo pages to the testRigor Playground mobile application. The application uses a modular architecture that makes it simple to add new demos without modifying core functionality.

## Architecture

The demo system consists of four key components:

1. **Demo Type Definition** (`types/demo.ts`) - TypeScript interface for demo configuration
2. **Demo Configuration** (`constants/demos.ts`) - Central registry of all available demos
3. **Demo Pages** (`app/demos/*.tsx`) - Individual demo implementations
4. **Root Layout** (`app/_layout.tsx`) - Navigation route configuration

## Prerequisites

- Basic understanding of React Native and TypeScript
- Familiarity with Expo Router for navigation
- Knowledge of NativeWind (Tailwind CSS) for styling

## Step-by-Step Guide

### Step 1: Create the Demo Page

Create a new file in `app/demos/` with a descriptive name using kebab-case:

```bash
app/demos/your-demo-name.tsx
```

**Example Structure:**

```tsx
import { View, Text, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function YourDemoScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Your Demo Title',
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#000',
        }} 
      />
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-6">
          {/* Demo Header */}
          <View className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 rounded-xl p-3 mr-4">
                <Ionicons 
                  name="icon-name" 
                  size={32} 
                  color="#3B82F6"
                />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-black mb-1">
                  Your Demo Title
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 leading-6">
              Brief description of what this demo does
            </Text>
          </View>

          {/* Demo Content */}
          <View className="bg-white rounded-2xl p-6 border-2 border-gray-100">
            <Text className="text-lg font-semibold text-black mb-4">
              Demo Content
            </Text>
            {/* Your demo implementation goes here */}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
```

### Step 2: Register the Demo

Add your demo to the `DEMOS` array in `constants/demos.ts`:

```typescript
export const DEMOS: Demo[] = [
  // ... existing demos
  {
    id: 'your-demo-name',              // Must match filename (kebab-case)
    title: 'Your Demo Title',          // Display name on home screen
    description: 'Brief description',   // Subtitle on demo card
    icon: 'icon-name',                 // Ionicons icon name
    route: '/demos/your-demo-name',    // Must match /demos/{filename}
  },
];
```

**Important Notes:**
- The `id` should match your demo filename
- The `route` must follow the pattern `/demos/{filename}`
- Use [Ionicons](https://icons.expo.fyi/) for the icon name

### Step 3: Add Navigation Route

Register the route in `app/_layout.tsx`:

```tsx
<Stack>
  <Stack.Screen name="index" options={{ headerShown: false }} />
  {/* Existing demo routes */}
  <Stack.Screen name="demos/your-demo-name" options={{ headerShown: true }} />
</Stack>
```

**Important:** The screen name must match your demo filename.

## Styling Guidelines

### Color Palette

The application uses a consistent color scheme:

- **Primary Red**: `#EF4444` (red-500)
- **Secondary Blue**: `#3B82F6` (blue-500)
- **Text**: `#000000` (black)
- **Background**: `#F9FAFB` (gray-50)
- **Card Background**: `#FFFFFF` (white)
- **Border**: `#F3F4F6` (gray-100)

### Common Components

**Icon Container:**
```tsx
<View className="bg-blue-100 rounded-xl p-3 mr-4">
  <Ionicons name="icon-name" size={32} color="#3B82F6" />
</View>
```

**Success Message:**
```tsx
<View className="bg-green-50 rounded-xl p-4 border border-green-200">
  <View className="flex-row items-center">
    <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
    <Text className="text-green-800 font-medium ml-2">
      Success message here
    </Text>
  </View>
</View>
```

**Error Message:**
```tsx
<View className="bg-red-50 rounded-xl p-4 border border-red-200">
  <View className="flex-row items-center">
    <Ionicons name="alert-circle" size={24} color="#EF4444" />
    <Text className="text-red-800 font-medium ml-2">
      Error message here
    </Text>
  </View>
</View>
```

**Button:**
```tsx
<Pressable
  onPress={handlePress}
  className="bg-blue-500 rounded-xl py-4 px-6 items-center active:bg-blue-600"
>
  <Text className="text-white font-semibold text-lg">
    Button Text
  </Text>
</Pressable>
```

## Demo Card Ordering

Demos appear on the home screen in the order they are defined in `constants/demos.ts`. Place more important or commonly used demos at the top of the array.

## Testing Your Demo

1. Save all files
2. The Expo development server should automatically reload
3. Navigate to the home screen
4. Your demo card should appear in the list
5. Tap the card to verify navigation works
6. Test all interactive elements within your demo

## Common Issues

### Demo Not Appearing on Home Screen

**Cause:** Demo not added to `constants/demos.ts`

**Solution:** Verify the demo object is properly added to the `DEMOS` array

### Navigation Error

**Cause:** Route not registered in `app/_layout.tsx`

**Solution:** Add `<Stack.Screen name="demos/your-demo-name" ... />` to the Stack

### Screen Name Mismatch Error

**Cause:** Filename doesn't match the route or screen name

**Solution:** Ensure consistency:
- Filename: `your-demo-name.tsx`
- Route: `/demos/your-demo-name`
- Screen name: `demos/your-demo-name`
- Demo id: `your-demo-name`

### Styling Not Applied

**Cause:** NativeWind may need cache clearing

**Solution:** Restart Expo with cache clear:
```bash
npx expo start --clear
```

## Best Practices

1. **Keep demos focused**: Each demo should test one specific feature or interaction
2. **Use descriptive names**: Choose clear, self-explanatory names for files and titles
3. **Follow the template**: Maintain consistency with existing demo structure
4. **Add clear instructions**: Include helpful text explaining what the user should do
5. **Provide feedback**: Show success/error states for all interactions
6. **Handle edge cases**: Consider error states and loading states
7. **Test on multiple devices**: Verify the demo works on both iOS and Android

## Example: Adding a Text Input Demo

1. Create `app/demos/text-input.tsx`:

```tsx
import { View, Text, ScrollView, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function TextInputScreen() {
  const [text, setText] = useState('');

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Text Input',
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#000',
        }} 
      />
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-6">
          <View className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 rounded-xl p-3 mr-4">
                <Ionicons name="create-outline" size={32} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-black mb-1">
                  Text Input
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 leading-6">
              Validate text input functionality
            </Text>
          </View>

          <View className="bg-white rounded-2xl p-6 border-2 border-gray-100">
            <Text className="text-lg font-semibold text-black mb-4">
              Enter Text
            </Text>
            
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type something..."
              className="border-2 border-gray-200 rounded-xl p-4 text-base mb-4"
            />

            {text && (
              <View className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <Text className="text-blue-800 font-medium">
                  You typed: {text}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
```

2. Add to `constants/demos.ts`:

```typescript
{
  id: 'text-input',
  title: 'Text Input',
  description: 'Validate text input functionality',
  icon: 'create-outline',
  route: '/demos/text-input',
}
```

3. Add to `app/_layout.tsx`:

```tsx
<Stack.Screen name="demos/text-input" options={{ headerShown: true }} />
```

## Additional Resources

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Ionicons Gallery](https://icons.expo.fyi/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

## Support

For questions or issues related to adding demos, please refer to the project's main README or contact the development team.
