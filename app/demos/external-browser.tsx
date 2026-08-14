import { Ionicons } from '@expo/vector-icons';

import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

const EXTERNAL_BROWSER_URL = 'https://testrigorplayground.netlify.app';
const EXPECTED_BROWSER_TITLE = 'testRigor Playground';
const NATIVE_MARKER = 'Native app context marker';

export default function ExternalBrowserScreen() {
  const [isOpening, setIsOpening] = useState(false);

  const openExternalBrowser = async () => {
    setIsOpening(true);

    try {
      if (!(await Linking.canOpenURL(EXTERNAL_BROWSER_URL))) {
        Alert.alert('Error', 'Unable to open the browser URL.');
        return;
      }

      await Linking.openURL(EXTERNAL_BROWSER_URL);
    } catch (error) {
      console.error('Failed to open external browser:', error);
      Alert.alert('Error', 'Failed to open the external browser.');
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mr-4">
              <Ionicons name="open-outline" size={32} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-black dark:text-white mb-1 text-center">
                External Browser
              </Text>
            </View>
          </View>
          <Text className="text-base text-gray-600 dark:text-gray-400 leading-6 text-center">
            Opens the device browser outside the app. Unlike the embedded WebView demo,
            testRigor uses switch context to browser for web steps and switch context to
            native to return to the app.
          </Text>
        </View>

        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
          <Text className="text-lg font-semibold text-black dark:text-white mb-4 text-center">
            Open External Browser
          </Text>

          <View className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-4">
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1 text-center">URL:</Text>
            <Text testID="external-browser-url" className="text-base text-black dark:text-white text-center">
              {EXTERNAL_BROWSER_URL}
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mt-3 mb-1 text-center">
              Expected in browser:
            </Text>
            <Text
              testID="external-browser-expected-title"
              className="text-base text-black dark:text-white text-center"
            >
              {EXPECTED_BROWSER_TITLE}
            </Text>
          </View>

          <Pressable
            testID="open-external-browser-button"
            accessibilityLabel="Open External Browser"
            onPress={openExternalBrowser}
            disabled={isOpening}
            className={`flex-row items-center justify-center rounded-xl py-4 px-4 ${
              isOpening ? 'bg-gray-400' : 'bg-blue-500 active:bg-blue-600'
            }`}
          >
            {isOpening ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="open-outline" size={22} color="#fff" />
                <Text className="text-white font-semibold text-base ml-2 text-center">
                  Open External Browser
                </Text>
              </>
            )}
          </Pressable>
        </View>

        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
          <Text className="text-lg font-semibold text-black dark:text-white mb-3 text-center">
            Native context
          </Text>
          <Text
            testID="native-context-marker"
            className="text-base text-gray-700 dark:text-gray-300 text-center"
          >
            {NATIVE_MARKER}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
