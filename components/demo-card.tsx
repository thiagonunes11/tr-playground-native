import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Demo } from '@/types/demo';

interface DemoCardProps {
  demo: Demo;
}

export function DemoCard({ demo }: DemoCardProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handlePress = () => {
    router.push(demo.route as any);
  };

  return (
    <Pressable
      testID={`demo-card-${demo.id}`}
      accessibilityLabel={demo.title}
      accessibilityRole="button"
      onPress={handlePress}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-4 border-2 border-gray-100 dark:border-gray-700 shadow-sm"
    >
      <View className="flex-row items-start">
        {/* Icon Container */}
        <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mr-4">
          <Ionicons
            name={demo.icon}
            size={28}
            color="#3B82F6"
          />
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text className="text-lg font-semibold text-black dark:text-white mb-2">
            {demo.title}
          </Text>

          <Text className="text-sm text-gray-600 dark:text-gray-400 leading-5">
            {demo.description}
          </Text>
        </View>

        {/* Arrow Icon */}
        <View className="ml-2 mt-1">
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? '#6B7280' : '#9CA3AF'}
          />
        </View>
      </View>
    </Pressable>
  );
}
