import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Text, View } from 'react-native';

const NOTIFICATION_CHANNEL_ID = 'tr-playground-notifications';
const NOTIFICATION_TITLE = 'testRigor Playground Notification';
const NOTIFICATION_BODY =
  'Tap this notification to validate context switching in your test automation.';

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

export default function SystemNotificationScreen() {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [notificationSent, setNotificationSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isExpoGo) {
      return;
    }
    ensureNotificationPermissions().then(setPermissionGranted);
  }, []);

  const handleSendNotification = async () => {
    if (isExpoGo) {
      Alert.alert(
        'Development Build Required',
        'System notifications are not supported in Expo Go on Android (SDK 53+). Run npm run start:dev after rebuilding with npx expo run:android.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsSending(true);

    try {
      const Notifications = await loadNotifications();
      if (!Notifications) {
        return;
      }

      const granted = await ensureNotificationPermissions();
      setPermissionGranted(granted);

      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Notification permission is required to run this demo.',
          [{ text: 'OK' }]
        );
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: NOTIFICATION_TITLE,
          body: NOTIFICATION_BODY,
          data: { demo: 'system-notification' },
        },
        trigger: null,
      });

      setNotificationSent(true);
    } catch (error) {
      console.error('Failed to send notification:', error);
      Alert.alert('Error', 'Failed to send the notification. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'System Notification',
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#000',
        }}
      />
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-6">
          <View className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 rounded-xl p-3 mr-4">
                <Ionicons name="notifications-outline" size={32} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-black mb-1">
                  System Notification
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 leading-6">
              Trigger a system-level notification to validate that automated tests
              can switch context from the app to the notification shade.
            </Text>
          </View>

          {isExpoGo && (
            <View className="bg-amber-50 rounded-2xl p-4 mb-6 border-2 border-amber-200">
              <View className="flex-row items-start">
                <Ionicons name="warning-outline" size={24} color="#D97706" />
                <View className="flex-1 ml-3">
                  <Text className="text-amber-900 font-semibold mb-1">
                    Development build required
                  </Text>
                  <Text className="text-amber-800 text-sm leading-5">
                    expo-notifications is not supported in Expo Go on Android. Rebuild
                    with npx expo run:android, then start Metro with npm run start:dev.
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View className="bg-white rounded-2xl p-6 border-2 border-gray-100">
            <Text className="text-lg font-semibold text-black mb-4">
              Send Notification
            </Text>

            {!isExpoGo && permissionGranted !== null && (
              <View
                className={`rounded-xl p-4 mb-4 ${
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

            <Pressable
              testID="trigger-notification-button"
              accessibilityLabel="Send system notification"
              onPress={handleSendNotification}
              disabled={isSending || isExpoGo}
              className={`rounded-xl py-4 px-6 items-center flex-row justify-center ${
                isSending || isExpoGo ? 'bg-gray-400' : 'bg-blue-500 active:bg-blue-600'
              }`}
            >
              <Ionicons name="notifications" size={24} color="#fff" />
              <Text className="text-white font-semibold text-lg ml-2">
                {isSending ? 'Sending...' : 'Send Notification'}
              </Text>
            </Pressable>

            <View className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <Text className="text-sm text-gray-600 mb-2">Expected notification:</Text>
              <Text className="text-base font-semibold text-black mb-1">
                {NOTIFICATION_TITLE}
              </Text>
              <Text className="text-sm text-gray-600">{NOTIFICATION_BODY}</Text>
            </View>

            {notificationSent && (
              <View className="bg-green-50 rounded-xl p-4 border border-green-200 mt-4">
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                  <Text className="text-green-800 font-medium ml-2 flex-1">
                    Notification sent. Open the notification shade to interact with it.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
