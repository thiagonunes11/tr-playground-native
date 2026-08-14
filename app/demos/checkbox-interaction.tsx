import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

function CheckboxItem({
  label,
  checked,
  onPress,
  testID,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityLabel={label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onPress}
      className="flex-row items-center py-3"
    >
      <View className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
        checked
          ? 'bg-blue-500 border-blue-500'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
      }`}>
        {checked && (
          <Ionicons name="checkmark" size={16} color="white" />
        )}
      </View>
      <Text className="text-base text-gray-700 dark:text-gray-300">{label}</Text>
    </Pressable>
  );
}

const OPTIONS = [
  { key: 'option1', label: 'Option 1: Basic selection' },
  { key: 'option2', label: 'Option 2: Multiple choice' },
  { key: 'option3', label: 'Option 3: Advanced features' },
  { key: 'option4', label: 'Option 4: Premium options' },
] as const;

type OptionKey = (typeof OPTIONS)[number]['key'];

const NONE_SELECTED: Record<OptionKey, boolean> = {
  option1: false,
  option2: false,
  option3: false,
  option4: false,
};

export default function CheckboxInteractionScreen() {
  const [checkboxes, setCheckboxes] = useState<Record<OptionKey, boolean>>(NONE_SELECTED);

  const toggleCheckbox = (key: OptionKey) => {
    setCheckboxes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const allSelected = Object.values(checkboxes).every(Boolean);

  const selectAll = () => {
    setCheckboxes({
      option1: !allSelected,
      option2: !allSelected,
      option3: !allSelected,
      option4: !allSelected,
    });
  };

  const clearAll = () => {
    setCheckboxes(NONE_SELECTED);
  };

  const checkedCount = Object.values(checkboxes).filter(Boolean).length;
  const totalCount = OPTIONS.length;

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        {/* Demo Header */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mr-4">
              <Ionicons
                name="checkbox-outline"
                size={32}
                color="#3B82F6"
              />
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-black dark:text-white mb-1">
                Checkbox Interaction
              </Text>
            </View>
          </View>
          <Text className="text-base text-gray-600 dark:text-gray-400 leading-6">
            Validate checkbox selection and interaction functionality
          </Text>
        </View>

        {/* Demo Content */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
          <Text className="text-lg font-semibold text-black dark:text-white mb-6">
            Select Options
          </Text>

          {/* Individual Checkboxes */}
          <View className="mb-6">
            {OPTIONS.map(({ key, label }) => (
              <CheckboxItem
                key={key}
                testID={`checkbox-${key}`}
                label={label}
                checked={checkboxes[key]}
                onPress={() => toggleCheckbox(key)}
              />
            ))}
          </View>

          {/* Control Buttons */}
          <View className="flex-row justify-between mb-6">
            <Pressable
              testID="select-all-button"
              accessibilityLabel={allSelected ? 'Deselect All' : 'Select All'}
              accessibilityRole="button"
              onPress={selectAll}
              className="bg-blue-500 rounded-xl py-3 px-6 items-center flex-1 mr-2 active:bg-blue-600"
            >
              <Text className="text-white font-semibold">
                {allSelected ? 'Deselect All' : 'Select All'}
              </Text>
            </Pressable>

            <Pressable
              testID="clear-all-button"
              accessibilityLabel="Clear All"
              accessibilityRole="button"
              onPress={clearAll}
              className="bg-gray-500 rounded-xl py-3 px-6 items-center flex-1 ml-2 active:bg-gray-600"
            >
              <Text className="text-white font-semibold">
                Clear All
              </Text>
            </Pressable>
          </View>

          {/* Status Display */}
          <View className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Selection Status:
            </Text>
            <Text
              testID="checkbox-selection-status"
              className="text-lg font-semibold text-black dark:text-white"
            >
              {checkedCount} of {totalCount} options selected
            </Text>

            {checkedCount > 0 && (
              <View className="mt-3">
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">Selected:</Text>
                {OPTIONS.filter(({ key }) => checkboxes[key]).map(({ key }) => (
                  <Text
                    key={key}
                    testID={`checkbox-selected-${key}`}
                    className="text-sm text-blue-600 dark:text-blue-400"
                  >
                    • {key.replace('option', 'Option ')}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {/* Success Message */}
          {checkedCount === totalCount && (
            <View
              testID="checkbox-all-selected-message"
              className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800 mt-4"
            >
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                <Text className="text-green-800 dark:text-green-200 font-medium ml-2 flex-1">
                  All options selected! Checkbox interaction validated.
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
