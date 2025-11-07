import { View, Text, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TestDemoScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Test Demo',
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
                  name="flask-outline" 
                  size={32} 
                  color="#3B82F6"
                />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-black mb-1">
                  Test Demo
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 leading-6">
              A working demo to test navigation and layout
            </Text>
          </View>

          {/* Demo Content */}
          <View className="bg-white rounded-2xl p-6 border-2 border-gray-100">
            <Text className="text-lg font-semibold text-black mb-4">
              Demo Content
            </Text>
            <Text className="text-gray-600 mb-4">
              This is where you'll implement your interactive demo content.
            </Text>
            <View className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <Text className="text-blue-800 font-medium mb-2">
                Navigation is working!
              </Text>
              <Text className="text-blue-600 text-sm">
                You can now create separate demo pages and link to them from the home screen.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
