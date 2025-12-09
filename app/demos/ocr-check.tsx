import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function OCRDemo() {
  return (
    <ThemedView className="flex-1">
      <ScrollView className="flex-1 p-6">
        <View className="items-center mb-8">
          <ThemedText className="text-3xl font-bold mb-4 text-center">
            OCR Check
          </ThemedText>
          <ThemedText className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
            Use OCR to check for the content of the page.
          </ThemedText>
        </View>

        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
          <Image
            source={require('@/assets/images/demo/OCR_TEXT.png')}
            className="w-full h-64 rounded-xl"
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}