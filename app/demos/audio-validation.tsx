import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function AudioValidationScreen() {
  const [playingSampleA, setPlayingSampleA] = useState(false);
  const [playingSampleB, setPlayingSampleB] = useState(false);
  const [soundA, setSoundA] = useState<Audio.Sound | null>(null);
  const [soundB, setSoundB] = useState<Audio.Sound | null>(null);

  const playAudio = async (sample: 'A' | 'B') => {
    try {
      // Stop any currently playing audio
      if (soundA) await soundA.stopAsync();
      if (soundB) await soundB.stopAsync();
      
      if (sample === 'A') {
        setPlayingSampleA(true);
        setPlayingSampleB(false);
        
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/audio/sampleA.mp3'),
          { shouldPlay: true }
        );
        setSoundA(sound);
        
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setPlayingSampleA(false);
          }
        });
      } else {
        setPlayingSampleB(true);
        setPlayingSampleA(false);
        
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/audio/sampleB.mp3'),
          { shouldPlay: true }
        );
        setSoundB(sound);
        
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setPlayingSampleB(false);
          }
        });
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingSampleA(false);
      setPlayingSampleB(false);
    }
  };

  const stopAudio = async () => {
    if (soundA) {
      await soundA.stopAsync();
      await soundA.unloadAsync();
      setSoundA(null);
    }
    if (soundB) {
      await soundB.stopAsync();
      await soundB.unloadAsync();
      setSoundB(null);
    }
    setPlayingSampleA(false);
    setPlayingSampleB(false);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Audio Validation',
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
                  name="volume-high-outline" 
                  size={32} 
                  color="#3B82F6"
                />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-black mb-1">
                  Audio Validation
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 leading-6">
              Validate audio playback functionality.
            </Text>
          </View>

          {/* Audio Samples */}
          <View className="gap-4">
            {/* Sample A */}
            <View className="bg-white rounded-2xl p-6 border-2 border-gray-100">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-semibold text-black">
                  Sample A
                </Text>
                {playingSampleA && (
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                    <Text className="text-sm text-red-500 font-medium">Playing</Text>
                  </View>
                )}
              </View>
              
              <Pressable
                onPress={() => playingSampleA ? stopAudio() : playAudio('A')}
                className="bg-blue-500 rounded-xl p-4 flex-row items-center justify-center"
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
            <View className="bg-white rounded-2xl p-6 border-2 border-gray-100">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-semibold text-black">
                  Sample B
                </Text>
                {playingSampleB && (
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                    <Text className="text-sm text-red-500 font-medium">Playing</Text>
                  </View>
                )}
              </View>
              
              <Pressable
                onPress={() => playingSampleB ? stopAudio() : playAudio('B')}
                className="bg-blue-500 rounded-xl p-4 flex-row items-center justify-center"
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
    </>
  );
}
