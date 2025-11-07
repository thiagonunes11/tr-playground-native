import { ScrollView, View, Text, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DemoCard } from '@/components/demo-card';
import { DEMOS } from '@/constants/demos';

export default function HomeScreen() {
  return (
    <>
      <StatusBar style="dark" />
      <ScrollView className="flex-1 bg-gray-50">
        {/* Header Section */}
        <View className="bg-white px-6 pt-16 pb-8">
          {/* Logo */}
          <View className="items-center mb-6">
            <Image
              source={require('@/assets/images/tr-playground.png')}
              style={{ width: 200, height: 50 }}
              resizeMode="contain"
            />
          </View>
          
          {/* Title and Description */}
          <View className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100">
            <Text className="text-3xl font-bold text-black text-center mb-3">
              Welcome to testRigor Playground
            </Text>
            <Text className="text-base text-gray-600 text-center leading-6">
              Explore our collection of interactive demos designed to help you test various web elements and interactions.
            </Text>
          </View>
        </View>

        {/* Demo Cards Section */}
        <View className="px-6 py-6">
          <Text className="text-2xl font-bold text-black mb-4">
            Interactive Demos
          </Text>
          
          {DEMOS.map((demo) => (
            <DemoCard key={demo.id} demo={demo} />
          ))}
        </View>
      </ScrollView>
    </>
  );
}
