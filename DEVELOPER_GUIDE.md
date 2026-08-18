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

### Dark mode

Every screen supports both schemes, so pair each colour utility with a `dark:`
variant. The conventions used across the demos:

| Light | Dark |
| --- | --- |
| `bg-gray-50` (page) | `dark:bg-gray-900` |
| `bg-white` (card) | `dark:bg-gray-800` |
| `bg-gray-50` (inner panel) | `dark:bg-gray-700` |
| `text-black` | `dark:text-white` |
| `text-gray-600` | `dark:text-gray-400` |
| `border-gray-100` / `border-gray-200` | `dark:border-gray-700` |
| `bg-blue-100` (icon container) | `dark:bg-blue-900/30` |

The scheme can be switched in-app with the toggle on the home screen and in every
demo header (`components/theme-toggle.tsx`, `testID="theme-toggle-button"`). It
starts out following the device and overrides it once tapped.

**Read the scheme from `@/hooks/use-color-scheme`, never from `react-native`
directly.** NativeWind's `dark:` variants follow NativeWind's own store, so a
component reading React Native's `useColorScheme` would ignore the toggle and
drift out of sync with the classes around it. That hook resolves NativeWind's
value first and falls back to the device.

Do not hardcode `headerStyle` / `headerTintColor` on a screen. The root layout's
`ThemeProvider` already themes the header, and a hardcoded colour survives the
toggle. `camera-validation` is the one deliberate exception, since its viewfinder
header stays dark in both schemes.

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
| Biometric Authentication | `expo-local-authentication` | Face ID requires a native development build on iOS; Android uses the system biometric prompt |
| WebView | `react-native-webview` | Embedded browser; works in Expo Go |
| Geo Location | `expo-location` | Requests foreground location permission; works in Expo Go. Rebuild dev client after first install. |
| Camera Validation | `expo-camera` | Requires camera permission |
| Audio Validation | `expo-audio` | Uses `useAudioPlayer` hooks |
| Date Picker | `@react-native-community/datetimepicker` | Platform-native picker |
| Form Inputs | `@react-native-picker/picker` | Renders `android.widget.Spinner` on Android; bundled in Expo Go |
| File Upload | `expo-document-picker` | Opens system file picker |
| File Download | `expo-file-system` | Writes to device storage |
| External Browser | — | Uses `Linking.openURL`; works in Expo Go |

### Testing biometric authentication

The biometric demo uses the same screen on both platforms and adapts to the
authentication methods reported by the operating system.

**iOS Simulator**

1. Open a Simulator that supports Face ID or Touch ID.
2. Use **Features → Face ID/Touch ID → Enrolled** to change enrollment state.
3. Start authentication in the app.
4. Choose **Matching** or **Non-matching Face/Touch** from the same menu.

Face ID requires a native development or preview build; it is not available in
Expo Go on iOS.

**Android Emulator**

1. Configure a screen lock and enroll a fingerprint in Android Settings.
2. Open the emulator's extended controls and select **Fingerprint**.
3. Start authentication in the app and send an enrolled or unknown fingerprint.

The available Android methods depend on the emulator image and device profile.

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

## Example: External Browser Demo

The External Browser demo opens the device default browser (Chrome, Safari, etc.) outside the app using `Linking.openURL`. Pair it with the **WebView** demo to exercise both browser contexts in testRigor:

| Demo | Where content runs | testRigor context |
|---|---|---|
| WebView | Embedded browser inside the app | `native` (default) |
| External Browser | Device browser app | `browser` after `switch context to browser` |

In testRigor, `switch context to native` targets the mobile app. `switch context to browser` targets the mobile browser content. Use these commands when a test crosses the app ↔ browser boundary — not for system overlays like the notification shade or share sheet, which testRigor handles in the default flow.

### Predictable content and testIDs

| Element | `testID` | Expected value |
|---|---|---|
| Open browser button | `open-external-browser-button` | — |
| Browser URL label | `external-browser-url` | `https://testrigorplayground.netlify.app` |
| Expected page title | `external-browser-expected-title` | `testRigor Playground` |
| Native context marker | `native-context-marker` | `Native app context marker` |

### Sample testRigor flow

```
tap "Open External Browser"
switch context to browser
validate page contains "testRigor Playground"
switch context to native
validate page contains "Native app context marker"
```

### Implementation notes

- Uses `Linking.openURL` — leaves the app entirely (unlike the embedded WebView demo)
- No extra native packages required; works in Expo Go
- The native marker stays on screen when the user returns to the app

### Register in `constants/demos.ts`

```typescript
{
  id: 'external-browser',
  title: 'External Browser',
  description: 'Open the device browser outside the app for native vs browser context tests',
  icon: 'open-outline',
  route: '/demos/external-browser',
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

## Example: Form Inputs Demo

`app/demos/form-inputs.tsx` covers two testRigor commands on one screen: `enter`
(keyboard Enter/Return key on native text fields) and `select` (native dropdown).

Both commands resolve their target by accessibility label, so the screen is built
around one rule: the label a test types must be the label the platform actually
exposes. A test author types what they read on screen, so every visible label here
is written to be character-for-character the field's `accessibilityLabel`. Two
things about the Notes field follow from that rule — it carries no placeholder,
and its on-screen label reads plain `Notes`. See the implementation notes below.

### Predictable content and testIDs

| Element | `testID` | Expected value |
|---|---|---|
| Full name field | `form-name-input` | — |
| Email field | `form-email-input` | — |
| Phone field | `form-phone-input` | — |
| Notes field (multiline) | `form-notes-input` | On-screen label and `accessibilityLabel` are both exactly `Notes`, empty or filled |
| Notes line counter | `form-notes-line-count` | `Lines: 1` before any newline |
| Enter press counter | `form-enter-count` | `Enter pressed: 0` on load |
| Last submitted field | `form-last-submitted-field` | `Last submitted field: none` on load |
| Country dropdown | `form-country-picker` | `Select a country` on load |
| Selected country label | `form-selected-country` | `Selected country: none` on load |
| Register button | `form-submit-button` | — |
| Submit summary | `form-submit-summary` | Rendered only after tapping Register |

### Sample testRigor flow

```
enter "Ada Lovelace" into "Full Name"
enter enter
check that page contains "Last submitted field: Full Name"
check that page contains "Enter pressed: 1"
enter "First line" into "Notes"
enter enter
check that page contains "Lines: 2"
check that page contains "Enter pressed: 1"
select "Brazil" from "Country"
check that page contains "Selected country: Brazil"
enter "ada@testrigor.com" into "Email"
tap "Register"
check that page contains "Ada Lovelace from Brazil registered successfully!"
```

The second `Enter pressed: 1` is the point of the Notes steps: Enter adds a line
there instead of submitting, so the counter must not move while `Lines` does.

### Implementation notes

- The single-line fields use `returnKeyType` plus `onSubmitEditing`, and
  `submitBehavior="submit"` keeps the keyboard open so focus can advance to the
  next field instead of dismissing it.
- `form-enter-count` and `form-last-submitted-field` exist so a test can assert
  the Enter key actually fired — without them the `enter` command has no
  observable effect.
- The Notes field is deliberately `multiline`, where Enter inserts a line break
  rather than submitting. `form-notes-line-count` makes that contrast assertable.
- **The label above the Notes field reads plain `Notes`, not `Notes (multiline)`.**
  The word "multiline" lives in the hint line below the field instead. While the
  label said `Notes (multiline)`, that string named only the label itself, never
  the field, so `enter ... into "Notes (multiline)"` had no editable element to
  resolve — measured on iOS with Appium/XCUITest:
  ```
  label "Full Name"          → StaticText   (the on-screen label)
                             → TextField    ← the input answers to it too
  label "Notes (multiline)"  → StaticText   (the on-screen label)
                             → nothing else; the input was named "Notes"
  ```
  The single-line fields worked only because their label text happened to equal
  their `accessibilityLabel`. Nothing about `multiline` was involved: pushing
  three `\n`-separated lines straight into the `XCUIElementTypeTextView` filled it
  and moved `form-notes-line-count` to `Lines: 3`.
- **The Notes field carries no `placeholder` on purpose.** React Native appends a
  multiline field's placeholder to its `accessibilityLabel` while the field is
  empty (`RCTUITextView.mm`, `- (NSString *)accessibilityLabel`), so on iOS the
  label read `Notes Press Enter here to add a new line` until something had been
  typed, and collapsed back to `Notes` afterwards. A command targeting `Notes`
  therefore failed on first use and only started working once the field already
  had text. The hint now lives in its own line below the field. Single-line
  fields are unaffected: `RCTUITextField` keeps `label` clean and exposes the
  placeholder as `value` and `placeholderValue` instead.
- The dropdown uses `mode="dropdown"` so Android renders a real
  `android.widget.Spinner`, which is what the `select` command resolves. On iOS
  the same component renders an inline `UIPickerView` wheel instead: it is always
  visible rather than opening on tap, and a selection is made by spinning it. A
  test that taps to open a list will not work there — assert against
  `form-selected-country` after the spin.
- The closed spinner sits on the app's own card, so its text and arrow colours
  come from the `Picker` `style` and `dropdownIconColor` props and follow the
  in-app theme toggle. The open popup is drawn with Android's theme, which
  follows the OS instead, so `Picker.Item` deliberately sets no `color` — a
  hardcoded one goes unreadable whenever the OS and the in-app toggle disagree.

### Register in `constants/demos.ts`

```typescript
{
  id: 'form-inputs',
  title: 'Form Inputs',
  description: 'Native text fields with Enter/Return handling and a native dropdown',
  icon: 'create-outline',
  route: '/demos/form-inputs',
}
```

## Additional Resources

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Ionicons Gallery](https://icons.expo.fyi/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

## Support

For questions or issues related to adding demos, please refer to the project's main README or contact the development team.
