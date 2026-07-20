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
        options={{
          title: 'Deep Link Receiver',
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
                  Deep Link Target Screen
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 leading-6">
              This screen is accessible exclusively via deep links (<Text className="font-mono text-blue-600">trplayground://demos/deep-link</Text>).
              It captures and displays dynamic payload parameters passed via external links or test automation.
            </Text>
          </View>

          {/* Deep Link Receiver & Payload Section */}
          <View className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-100">
            {/* Status Indicator */}
            <View className="items-center mb-4">
              <View
                testID="deeplink-status"
                className={`px-4 py-2 rounded-full border ${
                  hasParams
                    ? 'bg-green-100 border-green-300'
                    : 'bg-blue-100 border-blue-300'
                }`}
              >
                <Text className={`text-xs font-bold ${hasParams ? 'text-green-800' : 'text-blue-800'}`}>
                  {hasParams ? '● DEEPLINK PAYLOAD RECEIVED' : '✓ OPENED VIA DEEPLINK ROUTE'}
                </Text>
              </View>
            </View>

            {/* Raw Incoming URL Display */}
            <View className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
              <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Raw Incoming URL:
              </Text>
              <Text
                testID="deeplink-raw-url"
                className="text-sm text-black font-mono leading-5"
                selectable
              >
                {rawUrl || `${APP_SCHEME}`}
              </Text>
            </View>

            {/* Parsed Search Parameters */}
            <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Parsed Query Parameters:
              </Text>

              {hasParams ? (
                <View className="gap-2">
                  {searchParams.promo && (
                    <View className="flex-row items-center bg-white p-3 rounded-lg border border-gray-200 justify-between">
                      <Text className="text-sm font-semibold text-gray-700">promo:</Text>
                      <Text
                        testID="deeplink-param-promo"
                        className="text-sm font-bold text-blue-600 font-mono"
                      >
                        {String(searchParams.promo)}
                      </Text>
                    </View>
                  )}

                  {searchParams.source && (
                    <View className="flex-row items-center bg-white p-3 rounded-lg border border-gray-200 justify-between">
                      <Text className="text-sm font-semibold text-gray-700">source:</Text>
                      <Text
                        testID="deeplink-param-source"
                        className="text-sm font-bold text-purple-600 font-mono"
                      >
                        {String(searchParams.source)}
                      </Text>
                    </View>
                  )}

                  {searchParams.user && (
                    <View className="flex-row items-center bg-white p-3 rounded-lg border border-gray-200 justify-between">
                      <Text className="text-sm font-semibold text-gray-700">user:</Text>
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
                      <View key={key} className="flex-row items-center bg-white p-3 rounded-lg border border-gray-200 justify-between">
                        <Text className="text-sm font-semibold text-gray-700">{key}:</Text>
                        <Text
                          testID={`deeplink-param-${key}`}
                          className="text-sm font-bold text-gray-800 font-mono"
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
                    className="mt-3 bg-red-100 active:bg-red-200 rounded-lg py-2 px-3 items-center"
                  >
                    <Text className="text-red-700 font-semibold text-xs">
                      Clear Parameters
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <Text testID="deeplink-no-params-text" className="text-sm text-gray-500 italic text-center py-2">
                  No query parameters present in this deep link invocation.
                </Text>
              )}
            </View>
          </View>

          {/* CLI Automation Commands Guide */}
          <View className="bg-white rounded-2xl p-6 border-2 border-gray-100">
            <View className="flex-row items-center mb-3">
              <Ionicons name="terminal-outline" size={22} color="#1F2937" />
              <Text className="text-lg font-semibold text-black ml-2">
                Deep Link Trigger Commands
              </Text>
            </View>

            <Text className="text-xs text-gray-600 mb-4 leading-5">
              Execute these commands in terminal or testRigor steps to navigate directly to this screen:
            </Text>

            {/* Android ADB Native App */}
            <View className="bg-gray-900 rounded-xl p-3 mb-3">
              <Text className="text-xs font-semibold text-green-400 mb-1">
                Android ADB (Native App):
              </Text>
              <Text testID="cli-command-android" className="text-xs text-gray-200 font-mono" selectable>
                adb shell am start -W -a android.intent.action.VIEW -d &quot;trplayground://demos/deep-link?promo=BLACKFRIDAY&quot; com.thiagonunes11.trplayground
              </Text>
            </View>

            {/* Android Expo Go */}
            <View className="bg-gray-900 rounded-xl p-3 mb-3">
              <Text className="text-xs font-semibold text-amber-400 mb-1">
                Android ADB (Expo Go):
              </Text>
              <Text testID="cli-command-expogo" className="text-xs text-gray-200 font-mono" selectable>
                adb shell am start -W -a android.intent.action.VIEW -d &quot;exp://127.0.0.1:8081/--/demos/deep-link?promo=BLACKFRIDAY&quot; host.exp.exponent
              </Text>
            </View>

            {/* iOS Simulator */}
            <View className="bg-gray-900 rounded-xl p-3">
              <Text className="text-xs font-semibold text-blue-400 mb-1">
                iOS Simulator:
              </Text>
              <Text testID="cli-command-ios" className="text-xs text-gray-200 font-mono" selectable>
                xcrun simctl openurl booted &quot;trplayground://demos/deep-link?promo=BLACKFRIDAY&quot;
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
