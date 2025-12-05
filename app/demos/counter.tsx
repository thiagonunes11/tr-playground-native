import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function CounterDemo() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(prev => prev + 1);
  };

  const decrement = () => {
    setCount(prev => prev - 1);
  };

  return (
    <ThemedView className="flex-1 p-8">
      {/* Demo Header */}
      <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
        <View className="flex-row items-center mb-4">
          <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mr-4">
            <Ionicons
              name="calculator-outline"
              size={32}
              color="#3B82F6"
            />
          </View>
          <View className="flex-1">
            <ThemedText className="text-2xl font-bold mb-1">
              Counter
            </ThemedText>
          </View>
        </View>
        <ThemedText className="text-base text-gray-600 dark:text-gray-400 leading-6">
          Simple counter with increment and decrement functionality
        </ThemedText>
      </View>

      {/* Demo Content */}
      <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
        <ThemedText className="text-lg font-semibold mb-6 text-center">
          Counter Demo
        </ThemedText>

        {/* Counter Display */}
        <View className="items-center mb-8">
          <View className="bg-gray-50 dark:bg-gray-700 rounded-full w-56 h-56 items-center justify-center border-4 border-blue-200 dark:border-blue-800">
            <ThemedText 
              className="font-bold text-blue-600 dark:text-blue-400"
              style={{ 
                fontSize: 50,
                lineHeight: 60,
                textAlignVertical: 'center',
                paddingTop: 5
              }}
            >
              {count}
            </ThemedText>
          </View>
        </View>

        {/* Buttons */}
        <View className="flex-row justify-center">
          <Pressable
            onPress={decrement}
            className="bg-red-500 px-6 py-3 rounded-lg active:bg-red-600 mr-8"
          >
            <ThemedText className="text-white font-semibold text-lg">
              Decrement
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={increment}
            className="bg-green-500 px-6 py-3 rounded-lg active:bg-green-600"
          >
            <ThemedText className="text-white font-semibold text-lg">
              Increment
            </ThemedText>
          </Pressable>
        </View>
      </View>

      <View className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <ThemedText className="text-sm text-center">
          Use the buttons to increment or decrement the counter value.
        </ThemedText>
      </View>
    </ThemedView>
  );
}