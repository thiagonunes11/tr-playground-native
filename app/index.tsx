import { ScrollView, View, Text, Image } from 'react-native';
import { DemoCard } from '@/components/demo-card';
import { DEMOS } from '@/constants/demos';

export default function HomeScreen() {
  return (
    <ScrollView testID="home-screen" className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <View className="bg-white dark:bg-gray-800 px-6 pt-16 pb-8">
        {/* Logo */}
        <View className="items-center mb-6">
          <Image
            testID="home-logo"
            source={require('@/assets/images/tr-playground.png')}
            style={{ width: 200, height: 50 }}
            resizeMode="contain"
          />
        </View>

        {/* Title and Description */}
        <View className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
          <Text
            testID="home-title"
            className="text-3xl font-bold text-black dark:text-white text-center mb-3"
          >
            Welcome to testRigor Playground
          </Text>
          <Text className="text-base text-gray-600 dark:text-gray-400 text-center leading-6">
            Explore our collection of interactive demos designed to help you test various web elements and interactions.
          </Text>
        </View>
      </View>

      {/* Demo Cards Section */}
      <View className="px-6 py-6">
        <Text className="text-2xl font-bold text-black dark:text-white mb-4">
          Interactive Demos
        </Text>

        {DEMOS.map((demo) => (
          <DemoCard key={demo.id} demo={demo} />
        ))}
      </View>
    </ScrollView>
  );
}
