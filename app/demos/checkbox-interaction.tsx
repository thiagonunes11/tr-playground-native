import { View, Text, ScrollView, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function CheckboxInteractionScreen() {
  const [checkboxes, setCheckboxes] = useState({
    option1: false,
    option2: false,
    option3: false,
    option4: false,
  });

  const toggleCheckbox = (key: keyof typeof checkboxes) => {
    setCheckboxes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const selectAll = () => {
    const allSelected = Object.values(checkboxes).every(Boolean);
    setCheckboxes({
      option1: !allSelected,
      option2: !allSelected,
      option3: !allSelected,
      option4: !allSelected,
    });
  };

  const clearAll = () => {
    setCheckboxes({
      option1: false,
      option2: false,
      option3: false,
      option4: false,
    });
  };

  const checkedCount = Object.values(checkboxes).filter(Boolean).length;
  const totalCount = Object.keys(checkboxes).length;

  const CheckboxItem = ({
    label,
    checked,
    onPress
  }: {
    label: string;
    checked: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      className="flex-row items-center py-3"
    >
      <View className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
        checked ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white'
      }`}>
        {checked && (
          <Ionicons name="checkmark" size={16} color="white" />
        )}
      </View>
      <Text className="text-base text-gray-700">{label}</Text>
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Checkbox Interaction',
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#000',
        }}
      />
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-6">
          {/* Demo Header */}
          <View className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 rounded-xl p-3 mr-4">
                <Ionicons
                  name="checkbox-outline"
                  size={32}
                  color="#3B82F6"
                />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-black mb-1">
                  Checkbox Interaction
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 leading-6">
              Validate checkbox selection and interaction functionality
            </Text>
          </View>

          {/* Demo Content */}
          <View className="bg-white rounded-2xl p-6 border-2 border-gray-100">
            <Text className="text-lg font-semibold text-black mb-6">
              Select Options
            </Text>

            {/* Individual Checkboxes */}
            <View className="mb-6">
              <CheckboxItem
                label="Option 1: Basic selection"
                checked={checkboxes.option1}
                onPress={() => toggleCheckbox('option1')}
              />
              <CheckboxItem
                label="Option 2: Multiple choice"
                checked={checkboxes.option2}
                onPress={() => toggleCheckbox('option2')}
              />
              <CheckboxItem
                label="Option 3: Advanced features"
                checked={checkboxes.option3}
                onPress={() => toggleCheckbox('option3')}
              />
              <CheckboxItem
                label="Option 4: Premium options"
                checked={checkboxes.option4}
                onPress={() => toggleCheckbox('option4')}
              />
            </View>

            {/* Control Buttons */}
            <View className="flex-row justify-between mb-6">
              <Pressable
                onPress={selectAll}
                className="bg-blue-500 rounded-xl py-3 px-6 items-center flex-1 mr-2 active:bg-blue-600"
              >
                <Text className="text-white font-semibold">
                  {Object.values(checkboxes).every(Boolean) ? 'Deselect All' : 'Select All'}
                </Text>
              </Pressable>

              <Pressable
                onPress={clearAll}
                className="bg-gray-500 rounded-xl py-3 px-6 items-center flex-1 ml-2 active:bg-gray-600"
              >
                <Text className="text-white font-semibold">
                  Clear All
                </Text>
              </Pressable>
            </View>

            {/* Status Display */}
            <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <Text className="text-sm text-gray-600 mb-2">
                Selection Status:
              </Text>
              <Text className="text-lg font-semibold text-black">
                {checkedCount} of {totalCount} options selected
              </Text>

              {checkedCount > 0 && (
                <View className="mt-3">
                  <Text className="text-sm text-gray-600 mb-1">Selected:</Text>
                  {Object.entries(checkboxes).map(([key, checked]) =>
                    checked && (
                      <Text key={key} className="text-sm text-blue-600">
                        • {key.replace('option', 'Option ')}
                      </Text>
                    )
                  )}
                </View>
              )}
            </View>

            {/* Success Message */}
            {checkedCount === totalCount && (
              <View className="bg-green-50 rounded-xl p-4 border border-green-200 mt-4">
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                  <Text className="text-green-800 font-medium ml-2 flex-1">
                    All options selected! Checkbox interaction validated.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
