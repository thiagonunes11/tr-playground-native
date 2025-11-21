import React, { useState } from 'react';
import { View, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function DatePickerDemo() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);

    // Format the date as MM/DD/YYYY
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    setSelectedDate(formattedDate);
  };

  const showDatepicker = () => {
    setShowPicker(true);
  };

  return (
    <ThemedView className="flex-1 p-8">
      {/* Demo Header */}
      <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
        <View className="flex-row items-center mb-4">
          <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mr-4">
            <Ionicons
              name="calendar-outline"
              size={32}
              color="#3B82F6"
            />
          </View>
          <View className="flex-1">
            <ThemedText className="text-2xl font-bold mb-1">
              Date Picker
            </ThemedText>
          </View>
        </View>
        <ThemedText className="text-base text-gray-600 dark:text-gray-400 leading-6">
          Choose a date in the date picker to see the value in the field change
        </ThemedText>
      </View>

      {/* Demo Content */}
      <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
        <ThemedText className="text-lg font-semibold mb-4">
          Pick a date for the event:
        </ThemedText>

        <Pressable
          onPress={showDatepicker}
          className="bg-blue-500 p-4 rounded-lg active:bg-blue-600 mb-4"
        >
          <ThemedText className="text-white text-center font-semibold">
            Select Date
          </ThemedText>
        </Pressable>

        {selectedDate && (
          <View className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <ThemedText className="text-center text-lg font-medium">
              {selectedDate}
            </ThemedText>
          </View>
        )}

        {showPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>

      <View className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <ThemedText className="text-sm text-center">
          Tap "Select Date" to open the date picker and choose a date. The selected date will appear below.
        </ThemedText>
      </View>
    </ThemedView>
  );
}