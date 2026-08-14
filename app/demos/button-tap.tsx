import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function ButtonTapScreen() {
  const [isClicked, setIsClicked] = useState(false);

  const handleButtonPress = () => {
    setIsClicked(true);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        {/* Demo Header */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mr-4">
              <Ionicons
                name="hand-left-outline"
                size={32}
                color="#3B82F6"
              />
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-black dark:text-white mb-1">
                Button Tap
              </Text>
            </View>
          </View>
          <Text className="text-base text-gray-600 dark:text-gray-400 leading-6">
            Validate button click functionality
          </Text>
        </View>

        {/* Demo Content */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
          <Text className="text-lg font-semibold text-black dark:text-white mb-6">
            Click the Button
          </Text>

          {/* Button */}
          <Pressable
            testID="tap-button"
            accessibilityLabel="Click Me"
            accessibilityRole="button"
            onPress={handleButtonPress}
            className="bg-blue-500 rounded-xl py-4 px-6 items-center mb-6 active:bg-blue-600"
          >
            <Text className="text-white font-semibold text-lg">
              Click Me
            </Text>
          </Pressable>

          {/* Success Message */}
          {isClicked && (
            <View
              testID="tap-success-message"
              className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800"
            >
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                <Text className="text-green-800 dark:text-green-200 font-medium ml-2 flex-1">
                  The button was successfully clicked
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
