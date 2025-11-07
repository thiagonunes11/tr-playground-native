import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Demo } from '@/types/demo';

interface DemoCardProps {
  demo: Demo;
}

export function DemoCard({ demo }: DemoCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(demo.route as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-2xl p-6 mb-4 border-2 border-gray-100 shadow-sm"
    >
      <View className="flex-row items-start">
        {/* Icon Container */}
        <View className="bg-blue-100 rounded-xl p-3 mr-4">
          <Ionicons 
            name={demo.icon} 
            size={28} 
            color="#3B82F6"
          />
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text className="text-lg font-semibold text-black mb-2">
            {demo.title}
          </Text>
          
          <Text className="text-sm text-gray-600 leading-5">
            {demo.description}
          </Text>
        </View>

        {/* Arrow Icon */}
        <View className="ml-2 mt-1">
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color="#9CA3AF"
          />
        </View>
      </View>
    </Pressable>
  );
}
