import { Ionicons } from '@expo/vector-icons';
import { ScrollView, View } from 'react-native';

import { DemoCard } from '@/components/demo-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LOGIN_SCENARIOS, loginScenarioAsDemo } from '@/constants/login-scenarios';

export default function LoginScenariosDemo() {
  return (
    <ThemedView className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="p-8">
        {/* Demo Header */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mr-4">
              <Ionicons name="people-outline" size={32} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <ThemedText className="text-2xl font-bold mb-1">Login Scenarios</ThemedText>
            </View>
          </View>
          <ThemedText className="text-base text-gray-600 dark:text-gray-400 leading-6">
            Pick a flow to test.
          </ThemedText>
        </View>

        {LOGIN_SCENARIOS.map((scenario) => (
          <DemoCard key={scenario.slug} demo={loginScenarioAsDemo(scenario)} />
        ))}
      </ScrollView>
    </ThemedView>
  );
}
