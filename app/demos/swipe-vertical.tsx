import React, { useState, useRef } from 'react';
import { View, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function SwipeVerticalDemo() {
  const [swipeDirection, setSwipeDirection] = useState<string>('');
  const [swipeCount, setSwipeCount] = useState(0);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, dy } = gestureState;

        // Check if it's a vertical swipe (dy > dx)
        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 50) {
          if (dy > 0) {
            setSwipeDirection('Down');
            setSwipeCount(prev => prev + 1);
          } else {
            setSwipeDirection('Up');
            setSwipeCount(prev => prev + 1);
          }
        }
      },
    })
  );

  return (
    <ThemedView className="flex-1 p-8">
      {/* Demo Header */}
      <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
        <View className="flex-row items-center mb-4">
          <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mr-4">
            <Ionicons
              name="swap-vertical-outline"
              size={32}
              color="#3B82F6"
            />
          </View>
          <View className="flex-1">
            <ThemedText className="text-2xl font-bold mb-1">
              Swipe Vertical
            </ThemedText>
          </View>
        </View>
        <ThemedText className="text-base text-gray-600 dark:text-gray-400 leading-6">
          Test vertical swipe gestures (up and down) on the screen
        </ThemedText>
      </View>

      {/* Demo Content */}
      <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
        <ThemedText className="text-lg font-semibold mb-4">
          Swipe Detection Area
        </ThemedText>

        <View
          {...panResponder.current.panHandlers}
          className="h-48 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 items-center justify-center"
        >
          <Ionicons
            name="hand-left"
            size={48}
            color="#6B7280"
            className="mb-2"
            style={{ transform: [{ rotate: '90deg' }] }}
          />
          <ThemedText className="text-center text-gray-500 dark:text-gray-400">
            Swipe up or down here
          </ThemedText>
        </View>

        {/* Results */}
        <View className="mt-6">
          <ThemedText className="text-lg font-semibold mb-2">
            Swipe Results
          </ThemedText>

          <View className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <ThemedText className="text-base mb-1">
              Total Swipes: <ThemedText className="font-bold">{swipeCount}</ThemedText>
            </ThemedText>
            {swipeDirection && (
              <ThemedText className="text-base">
                Last Swipe: <ThemedText className="font-bold text-blue-600 dark:text-blue-400">{swipeDirection}</ThemedText>
              </ThemedText>
            )}
          </View>
        </View>

        {/* Validation Text */}
        {swipeCount > 0 && (
          <View className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <ThemedText className="text-center text-green-800 dark:text-green-200 font-medium">
              Vertical swipe validation successful! Detected {swipeCount} swipe{swipeCount > 1 ? 's' : ''}.
            </ThemedText>
          </View>
        )}
      </View>

      <View className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <ThemedText className="text-sm text-center">
          Swipe vertically across the detection area to test gesture recognition.
        </ThemedText>
      </View>
    </ThemedView>
  );
}