import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

const APP_SCHEME = 'trplayground://demos/deep-link';

export default function DeepLinkScreen() {
  const router = useRouter();
  const rawUrl = Linking.useURL();
  const searchParams = useLocalSearchParams<{
    promo?: string;
    source?: string;
    user?: string;
    role?: string;
  }>();

  const clearParams = () => {
    router.replace('/demos/deep-link' as any);
  };

  const hasParams = Object.keys(searchParams).length > 0;

  return (
    <>
      <Stack.Screen
        options={{ title: 'Deep Link Receiver' }}
      />
      <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <View className="p-6">
          {/* Header Card */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mr-4">
                <Ionicons name="link-outline" size={32} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-black dark:text-white mb-1">
                  Deep Link Target Screen
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 dark:text-gray-400 leading-6">
              This screen is accessible exclusively via deep links (<Text className="font-mono text-blue-600 dark:text-blue-400">trplayground://demos/deep-link</Text>).
              It captures and displays dynamic payload parameters passed via external links or test automation.
            </Text>
          </View>

          {/* Deep Link Receiver & Payload Section */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
            {/* Status Indicator */}
            <View className="items-center mb-4">
              <View
                testID="deeplink-status"
                className={`px-4 py-2 rounded-full border ${
                  hasParams
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700'
                    : 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'
                }`}
              >
                <Text className={`text-xs font-bold ${hasParams ? 'text-green-800 dark:text-green-200' : 'text-blue-800 dark:text-blue-200'}`}>
                  {hasParams ? '● DEEPLINK PAYLOAD RECEIVED' : '✓ OPENED VIA DEEPLINK ROUTE'}
                </Text>
              </View>
            </View>

            {/* Raw Incoming URL Display */}
            <View className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-4">
              <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                Raw Incoming URL:
              </Text>
              <Text
                testID="deeplink-raw-url"
                className="text-sm text-black dark:text-white font-mono leading-5"
                selectable
              >
                {rawUrl || `${APP_SCHEME}`}
              </Text>
            </View>

            {/* Parsed Search Parameters */}
            <View className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Parsed Query Parameters:
              </Text>

              {hasParams ? (
                <View className="gap-2">
                  {searchParams.promo && (
                    <View className="flex-row items-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 justify-between">
                      <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">promo:</Text>
                      <Text
                        testID="deeplink-param-promo"
                        className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono"
                      >
                        {String(searchParams.promo)}
                      </Text>
                    </View>
                  )}

                  {searchParams.source && (
                    <View className="flex-row items-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 justify-between">
                      <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">source:</Text>
                      <Text
                        testID="deeplink-param-source"
                        className="text-sm font-bold text-purple-600 dark:text-purple-400 font-mono"
                      >
                        {String(searchParams.source)}
                      </Text>
                    </View>
                  )}

                  {searchParams.user && (
                    <View className="flex-row items-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 justify-between">
                      <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">user:</Text>
                      <Text
                        testID="deeplink-param-user"
                        className="text-sm font-bold text-green-600 font-mono"
                      >
                        {String(searchParams.user)}
                      </Text>
                    </View>
                  )}

                  {/* Other dynamic params */}
                  {Object.entries(searchParams).map(([key, val]) => {
                    if (['promo', 'source', 'user'].includes(key)) return null;
                    return (
                      <View key={key} className="flex-row items-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 justify-between">
                        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">{key}:</Text>
                        <Text
                          testID={`deeplink-param-${key}`}
                          className="text-sm font-bold text-gray-800 dark:text-gray-200 font-mono"
                        >
                          {String(val)}
                        </Text>
                      </View>
                    );
                  })}

                  <Pressable
                    testID="clear-deeplink-params-button"
                    accessibilityLabel="Clear Parameters"
                    onPress={clearParams}
                    className="mt-3 bg-red-100 dark:bg-red-900/30 active:bg-red-200 rounded-lg py-2 px-3 items-center"
                  >
                    <Text className="text-red-700 dark:text-red-300 font-semibold text-xs">
                      Clear Parameters
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <Text testID="deeplink-no-params-text" className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-2">
                  No query parameters present in this deep link invocation.
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
