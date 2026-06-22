import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from 'react-native';

const NOTIFICATION_CHANNEL_ID = 'tr-playground-notifications';
const EXTERNAL_BROWSER_URL = 'https://testrigorplayground.netlify.app';

const NOTIFICATION_SINGLE = {
  title: 'testRigor Context Switch',
  body: 'Validate notification shade context switching',
};

const NOTIFICATION_STACK = [
  {
    title: 'testRigor Notification A',
    body: 'First notification for stacked context switch validation',
  },
  {
    title: 'testRigor Notification B',
    body: 'Second notification for stacked context switch validation',
  },
  {
    title: 'testRigor Notification C',
    body: 'Third notification for stacked context switch validation',
  },
] as const;

const SHARE_CONTENT = {
  title: 'testRigor Context Switch',
  message: 'testRigor Playground: validate share sheet context switch',
};

type ScenarioId =
  | 'notification'
  | 'notification-stack'
  | 'external-browser'
  | 'app-settings'
  | 'share-sheet';

const isExpoGo = Constants.appOwnership === 'expo';

type NotificationsModule = typeof import('expo-notifications');

let notificationsModule: NotificationsModule | null = null;
let handlerConfigured = false;

async function loadNotifications(): Promise<NotificationsModule | null> {
  if (isExpoGo) {
    return null;
  }

  if (!notificationsModule) {
    notificationsModule = await import('expo-notifications');
  }

  if (!handlerConfigured) {
    notificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    handlerConfigured = true;
  }

  return notificationsModule;
}

async function ensureNotificationPermissions(): Promise<boolean> {
  const Notifications = await loadNotifications();
  if (!Notifications) {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: 'testRigor Playground',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

async function sendNotification(
  content: { title: string; body: string },
  scenario: ScenarioId
): Promise<void> {
  const Notifications = await loadNotifications();
  if (!Notifications) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: content.title,
      body: content.body,
      data: { demo: 'system-context', scenario },
    },
    trigger: null,
  });
}

interface ScenarioCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  expectedLabel: string;
  expectedValue: string;
  testID: string;
  disabled?: boolean;
  loading?: boolean;
  triggered?: boolean;
  onPress: () => void;
}

function ScenarioCard({
  icon,
  title,
  description,
  expectedLabel,
  expectedValue,
  testID,
  disabled,
  loading,
  triggered,
  onPress,
}: ScenarioCardProps) {
  return (
    <View className="bg-white rounded-2xl p-6 mb-4 border-2 border-gray-100">
      <View className="flex-row items-start mb-3">
        <View className="bg-blue-100 rounded-xl p-3 mr-4">
          <Ionicons name={icon} size={24} color="#3B82F6" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-black mb-1">{title}</Text>
          <Text className="text-sm text-gray-600 leading-5">{description}</Text>
        </View>
      </View>

      <View className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
        <Text className="text-sm text-gray-600 mb-1">{expectedLabel}</Text>
        <Text className="text-base text-black">{expectedValue}</Text>
      </View>

      <Pressable
        testID={testID}
        accessibilityLabel={title}
        onPress={onPress}
        disabled={disabled || loading}
        className={`rounded-xl py-4 px-6 items-center flex-row justify-center ${
          disabled || loading ? 'bg-gray-400' : 'bg-blue-500 active:bg-blue-600'
        }`}
      >
        <Ionicons name={icon} size={22} color="#fff" />
        <Text className="text-white font-semibold text-base ml-2">
          {loading ? 'Triggering...' : title}
        </Text>
      </Pressable>

      {triggered && (
        <View
          testID={`${testID}-triggered`}
          className="bg-green-50 rounded-xl p-4 border border-green-200 mt-4"
        >
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle" size={22} color="#22C55E" />
            <Text className="text-green-800 font-medium ml-2 flex-1">
              Triggered. Switch to the system UI, interact, then return to the app.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default function SystemContextScreen() {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [loadingScenario, setLoadingScenario] = useState<ScenarioId | null>(null);
  const [triggeredScenarios, setTriggeredScenarios] = useState<Set<ScenarioId>>(new Set());

  useEffect(() => {
    if (isExpoGo) {
      return;
    }
    ensureNotificationPermissions().then(setPermissionGranted);
  }, []);

  const markTriggered = (scenario: ScenarioId) => {
    setTriggeredScenarios((prev) => new Set(prev).add(scenario));
  };

  const showDevBuildRequired = () => {
    Alert.alert(
      'Development Build Required',
      'Notification scenarios require a development build. Run npx expo run:android, then npm run start:dev.',
      [{ text: 'OK' }]
    );
  };

  const runNotificationScenario = async (scenario: ScenarioId) => {
    if (isExpoGo) {
      showDevBuildRequired();
      return;
    }

    setLoadingScenario(scenario);

    try {
      const granted = await ensureNotificationPermissions();
      setPermissionGranted(granted);

      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Notification permission is required for this scenario.',
          [{ text: 'OK' }]
        );
        return;
      }

      if (scenario === 'notification') {
        await sendNotification(NOTIFICATION_SINGLE, scenario);
      } else {
        for (const item of NOTIFICATION_STACK) {
          await sendNotification(item, scenario);
        }
      }

      markTriggered(scenario);
    } catch (error) {
      console.error('Failed to send notification:', error);
      Alert.alert('Error', 'Failed to send the notification. Please try again.');
    } finally {
      setLoadingScenario(null);
    }
  };

  const runExternalBrowser = async () => {
    setLoadingScenario('external-browser');

    try {
      const canOpen = await Linking.canOpenURL(EXTERNAL_BROWSER_URL);
      if (!canOpen) {
        Alert.alert('Error', 'Unable to open the external browser URL.');
        return;
      }

      await Linking.openURL(EXTERNAL_BROWSER_URL);
      markTriggered('external-browser');
    } catch (error) {
      console.error('Failed to open external browser:', error);
      Alert.alert('Error', 'Failed to open the external browser.');
    } finally {
      setLoadingScenario(null);
    }
  };

  const runAppSettings = async () => {
    setLoadingScenario('app-settings');

    try {
      await Linking.openSettings();
      markTriggered('app-settings');
    } catch (error) {
      console.error('Failed to open app settings:', error);
      Alert.alert('Error', 'Failed to open app settings.');
    } finally {
      setLoadingScenario(null);
    }
  };

  const runShareSheet = async () => {
    setLoadingScenario('share-sheet');

    try {
      await Share.share({
        title: SHARE_CONTENT.title,
        message: SHARE_CONTENT.message,
      });
      markTriggered('share-sheet');
    } catch (error) {
      console.error('Failed to open share sheet:', error);
      Alert.alert('Error', 'Failed to open the share sheet.');
    } finally {
      setLoadingScenario(null);
    }
  };

  const notificationsDisabled = isExpoGo;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'System Context Switch',
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#000',
        }}
      />
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-6">
          <View className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 rounded-xl p-3 mr-4">
                <Ionicons name="layers-outline" size={32} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-black mb-1">
                  System Context Switch
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 leading-6">
              Trigger native system UI surfaces that live outside the app. Unlike the
              embedded WebView demo, these scenarios require automated tests to switch
              context (notification shade, browser, settings, share sheet).
            </Text>
          </View>

          {isExpoGo && (
            <View className="bg-amber-50 rounded-2xl p-4 mb-6 border-2 border-amber-200">
              <View className="flex-row items-start">
                <Ionicons name="warning-outline" size={24} color="#D97706" />
                <View className="flex-1 ml-3">
                  <Text className="text-amber-900 font-semibold mb-1">
                    Notification scenarios need a development build
                  </Text>
                  <Text className="text-amber-800 text-sm leading-5">
                    Browser, settings, and share sheet work in Expo Go. Notifications
                    require npx expo run:android and npm run start:dev.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {!isExpoGo && permissionGranted !== null && (
            <View
              testID="notification-permission-status"
              className={`rounded-xl p-4 mb-6 ${
                permissionGranted
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name={permissionGranted ? 'checkmark-circle' : 'alert-circle'}
                  size={24}
                  color={permissionGranted ? '#22C55E' : '#EF4444'}
                />
                <Text
                  className={`font-medium ml-2 ${
                    permissionGranted ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {permissionGranted
                    ? 'Notification permission granted'
                    : 'Notification permission denied'}
                </Text>
              </View>
            </View>
          )}

          <Text className="text-lg font-bold text-black mb-3">Context Scenarios</Text>

          <ScenarioCard
            icon="notifications-outline"
            title="Send Notification"
            description="Posts a single OS notification. Tests must open the notification shade to read and tap it."
            expectedLabel="Expected notification:"
            expectedValue={`${NOTIFICATION_SINGLE.title} — ${NOTIFICATION_SINGLE.body}`}
            testID="trigger-notification-button"
            disabled={notificationsDisabled}
            loading={loadingScenario === 'notification'}
            triggered={triggeredScenarios.has('notification')}
            onPress={() => runNotificationScenario('notification')}
          />

          <ScenarioCard
            icon="albums-outline"
            title="Send Notification Stack"
            description="Posts three notifications at once. Tests must switch context and identify each title in the shade."
            expectedLabel="Expected titles (in order):"
            expectedValue={NOTIFICATION_STACK.map((item) => item.title).join(', ')}
            testID="trigger-notification-stack-button"
            disabled={notificationsDisabled}
            loading={loadingScenario === 'notification-stack'}
            triggered={triggeredScenarios.has('notification-stack')}
            onPress={() => runNotificationScenario('notification-stack')}
          />

          <ScenarioCard
            icon="open-outline"
            title="Open External Browser"
            description="Launches the device default browser outside the app. Tests must switch to the browser context."
            expectedLabel="Expected URL / page:"
            expectedValue={`${EXTERNAL_BROWSER_URL} (testRigor Playground)`}
            testID="open-external-browser-button"
            loading={loadingScenario === 'external-browser'}
            triggered={triggeredScenarios.has('external-browser')}
            onPress={runExternalBrowser}
          />

          <ScenarioCard
            icon="settings-outline"
            title="Open App Settings"
            description="Opens the OS settings screen for this app. Tests must leave the app and navigate system UI."
            expectedLabel="Expected screen:"
            expectedValue="testRigor Playground app settings"
            testID="open-app-settings-button"
            loading={loadingScenario === 'app-settings'}
            triggered={triggeredScenarios.has('app-settings')}
            onPress={runAppSettings}
          />

          <ScenarioCard
            icon="share-outline"
            title="Open Share Sheet"
            description="Opens the native share dialog. Tests must interact with the system share sheet overlay."
            expectedLabel="Expected share text:"
            expectedValue={SHARE_CONTENT.message}
            testID="open-share-sheet-button"
            loading={loadingScenario === 'share-sheet'}
            triggered={triggeredScenarios.has('share-sheet')}
            onPress={runShareSheet}
          />

          <View
            testID="context-switch-validation-hint"
            className="bg-blue-50 rounded-2xl p-4 border border-blue-200"
          >
            <Text className="text-blue-900 font-semibold mb-2">Validation tip</Text>
            <Text className="text-blue-800 text-sm leading-5">
              Each scenario exposes predictable text and testIDs. After switching context,
              assert the system UI content, perform the required action, then return to
              the app and verify the triggered status message appears.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
