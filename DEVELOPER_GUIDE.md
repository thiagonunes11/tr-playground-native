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

## Running the App

This project supports two development modes:

| Command | Mode | Use when |
|---|---|---|
| `npm start` or `npm run start:go` | **Expo Go** | Quick iteration; most demos work out of the box |
| `npm run start:dev` | **Development build** | After adding or updating native modules |

Press **`s`** in the Metro terminal to switch between Expo Go and the development build.

### Android emulator (recommended workflow)

Fresh Android emulators do not ship with Expo Go. Pressing **`a`** asks the CLI to download and install it automatically; if that download fails you will see `TypeError: fetch failed` and the app will not open.

Use this workflow on the emulator:

```bash
# 1. Forward Metro port from the emulator to your machine
adb reverse tcp:8081 tcp:8081

# 2. Start Metro in localhost mode (avoids LAN IP issues on emulators)
npx expo start --localhost

# 3. Press a to open on Android
```

**Install Expo Go manually** when the automatic download fails or the emulator has no internet:

1. Download the APK for SDK 54 from [expo-go-releases](https://github.com/expo/expo-go-releases/releases) (e.g. `Expo-Go-54.0.8.apk`).
2. Install on the running emulator:

```bash
adb install -r ~/Downloads/Expo-Go-54.0.8.apk
```

3. Confirm the package is present:

```bash
adb shell pm list packages | grep host.exp.exponent
```

4. If Metro is already running, open the project directly:

```bash
adb shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8081" host.exp.exponent
```

**Emulator has no internet:** If the emulator cannot reach the network (common after long sessions), cold boot it in Android Studio (**Device Manager → ⋮ → Cold Boot Now**) and run `adb reverse` again.

### macOS: Watchman and `~/Documents`

If Metro crashes on startup with:

```text
Watchman error: ... Operation not permitted
```

the project is likely under `~/Documents`, which macOS restricts unless Watchman has **Full Disk Access**.

This repo disables Watchman in `metro.config.js` so Metro uses the Node file crawler instead:

```js
config.resolver = {
  ...config.resolver,
  useWatchman: false,
};
```

A `.watchmanconfig` file also exists at the project root. To use Watchman again (faster file watching on large projects), either:

- Grant **Full Disk Access** to Terminal/Cursor and `watchman` in **System Settings → Privacy & Security**, or
- Move the repository outside `~/Documents` (e.g. `~/Developer/tr-playground-native`).

### Native modules

Some demos use native APIs (camera, audio, notifications, etc.). After adding a package with native code:

1. Run `npx expo run:android` or `npx expo run:ios` to rebuild the dev client
2. Start Metro with `npm run start:dev`

Expo Go includes most SDK 54 modules, but a custom dev build is required when native configuration changes (for example, adding the `expo-notifications` config plugin).

### Expo Go version

This project targets **Expo SDK 54**. The matching Expo Go build is **54.0.x** (see [expo-go-releases](https://github.com/expo/expo-go-releases/releases)).

If Metro prompts to upgrade Expo Go and the automatic download fails, install the recommended APK manually and answer **no** to the upgrade prompt. Cached APKs from a successful CLI download are stored under `~/.expo/android-apk-cache/`.

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

If your demo uses a native module, rebuild the dev client before testing:

```bash
npx expo run:android
npm run start:dev
```

## Demos with Native Dependencies

| Demo | Native package | Notes |
|---|---|---|
| WebView | `react-native-webview` | Embedded browser; works in Expo Go |
| Geo Location | `expo-location` | Requests foreground location permission; works in Expo Go. Rebuild dev client after first install. |
| Camera Validation | `expo-camera` | Requires camera permission |
| Audio Validation | `expo-audio` | Uses `useAudioPlayer` hooks |
| Date Picker | `@react-native-community/datetimepicker` | Platform-native picker |
| File Upload | `expo-document-picker` | Opens system file picker |
| File Download | `expo-file-system` | Writes to device storage |
| System Notification | `expo-notifications` | **Development build only** — not supported in Expo Go on Android (SDK 53+). Rebuild after adding the config plugin. |

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

### Cannot Find Native Module

**Cause:** Development build was compiled before a native package was added

**Solution:** Rebuild and use the dev client:
```bash
npx expo run:android
npm run start:dev
```

### Metro crashes with Watchman "Operation not permitted" (macOS)

**Cause:** Watchman cannot read the project directory (common when the repo lives in `~/Documents`).

**Solution:** Already handled in `metro.config.js` via `resolver.useWatchman: false`. If the error persists, restart Metro with `npx expo start --clear`. To re-enable Watchman, grant Full Disk Access or move the project out of `~/Documents`.

### `TypeError: fetch failed` when pressing `a` (Android)

**Cause:** Expo Go is not installed on the emulator and the CLI could not download it (network, firewall, or offline emulator).

**Solution:**

1. Install Expo Go 54.x manually — see [Android emulator (recommended workflow)](#android-emulator-recommended-workflow).
2. Run `adb reverse tcp:8081 tcp:8081` and start Metro with `npx expo start --localhost`.
3. Or switch to a development build with **`s`** and use `npm run start:dev`.

### No apps connected / reload failed

**Cause:** Expo Go is not running or Metro URL is unreachable from the device.

**Solution:** Open the app on the emulator first (`a` or the `adb shell am start` command above). For emulators, prefer `--localhost` plus `adb reverse` instead of the LAN IP (`exp://192.168.x.x:8081`).

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

## Example: System Notification Demo

The System Notification demo triggers an OS-level notification so automated testing tools must switch context (app → notification shade) to interact with it.

> **Important:** This demo requires a **development build**. `expo-notifications` was removed from Expo Go on Android starting with SDK 53. Use `npm run start:dev`, not Expo Go.

### Implementation notes

- Uses `expo-notifications` with `scheduleNotificationAsync` and `trigger: null` for immediate delivery
- **Lazy-loads** `expo-notifications` via dynamic `import()` so Expo Go does not crash on app startup — the module is only loaded in a development build when the demo is used
- Requests notification permission on first use (required on Android 13+ and iOS)
- Creates an Android notification channel before requesting permission
- Uses predictable title/body text for test automation:
  - **Title:** `testRigor Playground Notification`
  - **Body:** `Tap this notification to validate context switching in your test automation.`
- In-app trigger button has `testID="trigger-notification-button"`

### Setup steps

1. Install the package:

```bash
npx expo install expo-notifications
```

2. Add the config plugin to `app.json`:

```json
[
  "expo-notifications",
  {
    "defaultChannel": "tr-playground-notifications"
  }
]
```

3. Create `app/demos/system-notification.tsx`, register in `constants/demos.ts` and `app/_layout.tsx`

4. Rebuild the native app:

```bash
npx expo run:android
```

### Register in `constants/demos.ts`

```typescript
{
  id: 'system-notification',
  title: 'System Notification',
  description: 'Trigger a system notification to test context switching',
  icon: 'notifications-outline',
  route: '/demos/system-notification',
}
```

## Example: Geo Location Demo

The Geo Location demo requests foreground location access and validates that returned coordinates are usable for test automation.

### Implementation notes

- Uses `expo-location` with `getCurrentPositionAsync` and `Accuracy.Balanced`
- Requests foreground permission via `requestForegroundPermissionsAsync`
- Validates coordinates are finite and within standard ranges (latitude ±90, longitude ±180)
- Reverse-geocodes coordinates into a human-readable address (city, state, country)
- Displays latitude, longitude, and accuracy with `testID`s for automation:
  - `get-location-button`
  - `location-address`
  - `location-accuracy`
  - `location-validation-message`

### Setup steps

1. Install the package:

```bash
npx expo install expo-location
```

2. Add the config plugin to `app.json`:

```json
[
  "expo-location",
  {
    "locationWhenInUsePermission": "Allow testRigor Playground to access your location for the geolocation demo."
  }
]
```

3. Create `app/demos/geo-location.tsx`, register in `constants/demos.ts` and `app/_layout.tsx`

4. Rebuild the native app if using a development build:

```bash
npx expo run:android
```

### Register in `constants/demos.ts`

```typescript
{
  id: 'geo-location',
  title: 'Geo Location',
  description: 'Enable geolocation and validate device coordinates',
  icon: 'location-outline',
  route: '/demos/geo-location',
}
```

### Android emulator tip

If you see "Current location is unavailable", set a mock location in the emulator:

1. Open **Extended Controls** (⋯ button in the emulator toolbar)
2. Go to **Location**
3. Set latitude/longitude or pick a point on the map
4. Tap **Get Location** again in the demo

## Additional Resources

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Ionicons Gallery](https://icons.expo.fyi/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

## Support

For questions or issues related to adding demos, please refer to the project's main README or contact the development team.
