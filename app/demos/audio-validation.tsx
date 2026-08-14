import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function AudioValidationScreen() {
  const playerA = useAudioPlayer(require('@/assets/audio/sampleA.mp3'));
  const playerB = useAudioPlayer(require('@/assets/audio/sampleB.mp3'));
  const statusA = useAudioPlayerStatus(playerA);
  const statusB = useAudioPlayerStatus(playerB);

  const playingSampleA = statusA.playing;
  const playingSampleB = statusB.playing;

  const playAudio = (sample: 'A' | 'B') => {
    const target = sample === 'A' ? playerA : playerB;
    const other = sample === 'A' ? playerB : playerA;

    other.pause();
    other.seekTo(0);
    target.seekTo(0);
    target.play();
  };

  const stopAudio = () => {
    playerA.pause();
    playerA.seekTo(0);
    playerB.pause();
    playerB.seekTo(0);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        {/* Demo Header */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mr-4">
              <Ionicons
                name="volume-high-outline"
                size={32}
                color="#3B82F6"
              />
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-black dark:text-white mb-1">
                Audio Validation
              </Text>
            </View>
          </View>
          <Text className="text-base text-gray-600 dark:text-gray-400 leading-6">
            Validate audio playback functionality.
          </Text>
        </View>

        {/* Audio Samples */}
        <View className="gap-4">
          {/* Sample A */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-semibold text-black dark:text-white">
                Sample A
              </Text>
              {playingSampleA && (
                <View testID="audio-sample-a-playing" className="flex-row items-center">
                  <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                  <Text className="text-sm text-red-500 font-medium">Playing</Text>
                </View>
              )}
            </View>

            <Pressable
              testID="audio-sample-a-button"
              accessibilityLabel={playingSampleA ? 'Stop Sample A' : 'Play Sample A'}
              accessibilityRole="button"
              onPress={() => playingSampleA ? stopAudio() : playAudio('A')}
              className="bg-blue-500 rounded-xl p-4 flex-row items-center justify-center active:bg-blue-600"
            >
              <Ionicons
                name={playingSampleA ? "stop" : "play"}
                size={24}
                color="#fff"
              />
              <Text className="text-white font-semibold text-lg ml-2">
                {playingSampleA ? 'Stop' : 'Play Audio'}
              </Text>
            </Pressable>
          </View>

          {/* Sample B */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-semibold text-black dark:text-white">
                Sample B
              </Text>
              {playingSampleB && (
                <View testID="audio-sample-b-playing" className="flex-row items-center">
                  <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                  <Text className="text-sm text-red-500 font-medium">Playing</Text>
                </View>
              )}
            </View>

            <Pressable
              testID="audio-sample-b-button"
              accessibilityLabel={playingSampleB ? 'Stop Sample B' : 'Play Sample B'}
              accessibilityRole="button"
              onPress={() => playingSampleB ? stopAudio() : playAudio('B')}
              className="bg-blue-500 rounded-xl p-4 flex-row items-center justify-center active:bg-blue-600"
            >
              <Ionicons
                name={playingSampleB ? "stop" : "play"}
                size={24}
                color="#fff"
              />
              <Text className="text-white font-semibold text-lg ml-2">
                {playingSampleB ? 'Stop' : 'Play Audio'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
