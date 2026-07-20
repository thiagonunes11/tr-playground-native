import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import * as Linking from 'expo-linking';
import { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

export default function DeepLinkScreen() {
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Directly attempt to open the system URL scheme (avoiding canOpenURL false negatives on Android API 30+)
  const handleOpenURL = async (url: string, label: string) => {
    try {
      await Linking.openURL(url);
      setActionFeedback(`Successfully launched ${label}`);
    } catch (error) {
      console.error(`Failed to open URL ${url}:`, error);
      setActionFeedback(`Unable to launch ${label} (${url}). App may not be supported on this device/emulator.`);
      Alert.alert(
        'App Not Supported',
        `The URL scheme "${url}" could not be opened on this device/emulator.`
      );
    }
  };

  // System App Deep Links
  const openSystemSettings = async () => {
    try {
      await Linking.openSettings();
      setActionFeedback('Opened System Settings');
    } catch (error) {
      console.error('Failed to open settings:', error);
      setActionFeedback('Failed to open System Settings');
    }
  };

  const openPhone = () => {
    handleOpenURL('tel:15551234567', 'Phone / Dialer');
  };

  const openSMS = () => {
    const smsUrl = Platform.select({
      ios: 'sms:15551234567&body=Hello%20from%20testRigor%20Playground',
      default: 'sms:15551234567?body=Hello%20from%20testRigor%20Playground',
    });
    handleOpenURL(smsUrl, 'SMS / Messages');
  };

  const openEmail = () => {
    const mailUrl = 'mailto:support@testrigor.com?subject=Deep%20Link%20Test&body=Testing%20Deep%20Links%20in%20testRigor%20Playground';
    handleOpenURL(mailUrl, 'System Email Client');
  };

  const openMaps = () => {
    const mapsUrl = Platform.select({
      ios: 'maps://?q=San+Francisco&ll=37.7749,-122.4194',
      default: 'geo:37.7749,-122.4194?q=37.7749,-122.4194(San+Francisco)',
    });
    handleOpenURL(mapsUrl, 'System Maps App');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Deep Links',
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#000',
        }}
      />
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-6">
          {/* Header Card */}
          <View className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 rounded-xl p-3 mr-4">
                <Ionicons name="link-outline" size={32} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-black mb-1">
                  Deep Links
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 leading-6">
              Test opening native OS system applications (Phone, SMS, Email, Settings, Maps) using deep link URL schemes.
            </Text>
          </View>

          {/* System App Deep Links Card */}
          <View className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-100">
            <Text className="text-lg font-semibold text-black mb-2 text-center">
              System App Deep Links
            </Text>
            <Text className="text-sm text-gray-500 mb-4 text-center">
              Tap any option to trigger the native system application scheme (Android & iOS)
            </Text>

            <View className="gap-3">
              {/* Settings */}
              <Pressable
                testID="open-system-settings-button"
                accessibilityLabel="Open System Settings"
                onPress={openSystemSettings}
                className="flex-row items-center bg-gray-100 active:bg-gray-200 rounded-xl p-4 border border-gray-200"
              >
                <View className="bg-gray-200 rounded-lg p-2 mr-3">
                  <Ionicons name="settings-outline" size={22} color="#374151" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900">
                    System Settings
                  </Text>
                  <Text className="text-xs text-gray-500 font-mono">
                    Linking.openSettings()
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>

              {/* Phone */}
              <Pressable
                testID="open-system-phone-button"
                accessibilityLabel="Open Phone Dialer"
                onPress={openPhone}
                className="flex-row items-center bg-blue-50 active:bg-blue-100 rounded-xl p-4 border border-blue-200"
              >
                <View className="bg-blue-200 rounded-lg p-2 mr-3">
                  <Ionicons name="call-outline" size={22} color="#1D4ED8" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-blue-950">
                    Phone Dialer
                  </Text>
                  <Text className="text-xs text-blue-700 font-mono">
                    tel:15551234567
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#60A5FA" />
              </Pressable>

              {/* SMS */}
              <Pressable
                testID="open-system-sms-button"
                accessibilityLabel="Open SMS Messages"
                onPress={openSMS}
                className="flex-row items-center bg-green-50 active:bg-green-100 rounded-xl p-4 border border-green-200"
              >
                <View className="bg-green-200 rounded-lg p-2 mr-3">
                  <Ionicons name="chatbubble-outline" size={22} color="#15803D" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-green-950">
                    SMS / Messages
                  </Text>
                  <Text className="text-xs text-green-700 font-mono">
                    {Platform.OS === 'ios' ? 'sms:15551234567&body=...' : 'sms:15551234567?body=...'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#4ADE80" />
              </Pressable>

              {/* Email */}
              <Pressable
                testID="open-system-email-button"
                accessibilityLabel="Open System Email"
                onPress={openEmail}
                className="flex-row items-center bg-purple-50 active:bg-purple-100 rounded-xl p-4 border border-purple-200"
              >
                <View className="bg-purple-200 rounded-lg p-2 mr-3">
                  <Ionicons name="mail-outline" size={22} color="#6B21A8" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-purple-950">
                    System Email Client
                  </Text>
                  <Text className="text-xs text-purple-700 font-mono">
                    mailto:support@testrigor.com
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C084FC" />
              </Pressable>

              {/* Maps */}
              <Pressable
                testID="open-system-maps-button"
                accessibilityLabel="Open System Maps"
                onPress={openMaps}
                className="flex-row items-center bg-amber-50 active:bg-amber-100 rounded-xl p-4 border border-amber-200"
              >
                <View className="bg-amber-200 rounded-lg p-2 mr-3">
                  <Ionicons name="map-outline" size={22} color="#B45309" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-amber-950">
                    System Maps App
                  </Text>
                  <Text className="text-xs text-amber-700 font-mono">
                    {Platform.OS === 'ios' ? 'maps://?q=San+Francisco' : 'geo:37.7749,-122.4194'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#FBBF24" />
              </Pressable>
            </View>

            {actionFeedback && (
              <View className="mt-4 bg-blue-50 p-3 rounded-xl border border-blue-200">
                <Text testID="action-feedback-text" className="text-xs text-blue-800 text-center font-medium">
                  {actionFeedback}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
