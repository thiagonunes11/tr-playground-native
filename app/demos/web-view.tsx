import { Ionicons } from '@expo/vector-icons';

import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

const WEBVIEW_URL = 'https://testrigorplayground.netlify.app';
const EXPECTED_PAGE_TITLE = 'testRigor Playground';

export default function WebViewScreen() {
  const [isWebViewOpen, setIsWebViewOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(WEBVIEW_URL);
  const [currentTitle, setCurrentTitle] = useState(EXPECTED_PAGE_TITLE);
  const hasFinishedInitialLoad = useRef(false);

  const handleOpenWebView = () => {
    setIsWebViewOpen(true);
    setIsInitialLoading(true);
    setPageLoaded(false);
    setCurrentUrl(WEBVIEW_URL);
    setCurrentTitle(EXPECTED_PAGE_TITLE);
    hasFinishedInitialLoad.current = false;
  };

  const handleCloseWebView = () => {
    setIsWebViewOpen(false);
    setIsInitialLoading(true);
    setPageLoaded(false);
    hasFinishedInitialLoad.current = false;
  };

  const handleNavigationStateChange = (navState: {
    url: string;
    title?: string;
    loading: boolean;
  }) => {
    setCurrentUrl(navState.url);

    if (navState.title) {
      setCurrentTitle(navState.title);
    }

    if (!navState.loading) {
      setPageLoaded(true);
      if (!hasFinishedInitialLoad.current) {
        hasFinishedInitialLoad.current = true;
        setIsInitialLoading(false);
      }
    }
  };

  const handleLoadEnd = () => {
    setPageLoaded(true);
    if (!hasFinishedInitialLoad.current) {
      hasFinishedInitialLoad.current = true;
      setIsInitialLoading(false);
    }
  };

  if (isWebViewOpen) {
    return (
      <View className="flex-1 bg-white dark:bg-gray-800">
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <Text className="text-sm text-gray-600 dark:text-gray-400 flex-1 mr-3" numberOfLines={1}>
            {currentUrl}
          </Text>
          <Pressable
            testID="close-webview-button"
            accessibilityLabel="Close WebView"
            onPress={handleCloseWebView}
            className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 active:bg-gray-200 dark:active:bg-gray-600"
          >
            <Text className="text-gray-800 dark:text-gray-200 font-medium">Close</Text>
          </Pressable>
        </View>

        {isInitialLoading && (
          <View className="absolute inset-0 items-center justify-center bg-white dark:bg-gray-800 z-10">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-600 dark:text-gray-400 mt-3">Loading page...</Text>
          </View>
        )}

        <WebView
          testID="demo-webview"
          source={{ uri: WEBVIEW_URL }}
          startInLoadingState
          onNavigationStateChange={handleNavigationStateChange}
          onLoadEnd={handleLoadEnd}
          onError={() => {
            setIsInitialLoading(false);
            setPageLoaded(false);
            hasFinishedInitialLoad.current = true;
          }}
          className="flex-1"
        />

        {pageLoaded && !isInitialLoading && (
          <View className="bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800 px-4 py-3">
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
              <Text testID="webview-loaded-message" className="text-green-800 dark:text-green-200 font-medium ml-2">
                Page loaded: {currentTitle}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900 p-6">
      <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
        <View className="flex-row items-center mb-4">
          <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mr-4">
            <Ionicons name="globe-outline" size={32} color="#3B82F6" />
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-black dark:text-white mb-1">WebView</Text>
          </View>
        </View>
        <Text className="text-base text-gray-600 dark:text-gray-400 leading-6">
          Open the testRigor Playground web app in an embedded WebView to validate
          in-app browser interactions.
        </Text>
      </View>

      <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
        <Text className="text-lg font-semibold text-black dark:text-white mb-4">Open WebView</Text>

        <View className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-6">
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">URL:</Text>
          <Text testID="webview-url" className="text-base text-black dark:text-white">
            {WEBVIEW_URL}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mt-3 mb-1">Expected content:</Text>
          <Text testID="webview-expected-title" className="text-base text-black dark:text-white">
            {EXPECTED_PAGE_TITLE}
          </Text>
        </View>

        <Pressable
          testID="open-webview-button"
          accessibilityLabel="Open WebView"
          onPress={handleOpenWebView}
          className="bg-blue-500 rounded-xl py-4 px-6 items-center flex-row justify-center active:bg-blue-600"
        >
          <Ionicons name="open-outline" size={24} color="#fff" />
          <Text className="text-white font-semibold text-lg ml-2">Open WebView</Text>
        </Pressable>
      </View>
    </View>
  );
}
