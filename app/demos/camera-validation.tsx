import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { Camera, CameraView } from 'expo-camera';

export default function CameraValidationScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const requestPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const openCamera = async () => {
    if (hasPermission === null) {
      await requestPermissions();
    }

    if (hasPermission) {
      setIsCameraActive(true);
      setPhotoTaken(false);
    } else {
      Alert.alert(
        'Camera Permission Required',
        'Please grant camera permission to use this demo.',
        [{ text: 'OK' }]
      );
    }
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setPhotoTaken(true);
        setIsCameraActive(false);

        Alert.alert(
          'Photo Taken!',
          'Camera validation successful. Photo captured.',
          [{ text: 'OK' }]
        );
      } catch (error) {
        Alert.alert(
          'Error',
          'Failed to take photo. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const closeCamera = () => {
    setIsCameraActive(false);
  };

  if (isCameraActive) {
    return (
      <View className="flex-1">
        <Stack.Screen
          options={{
            title: 'Camera',
            headerStyle: { backgroundColor: '#000' },
            headerTintColor: '#fff',
          }}
        />
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
        >
          <View className="flex-1 justify-end pb-8">
            <View className="flex-row justify-center items-center px-6">
              <Pressable
                onPress={takePhoto}
                className="bg-white rounded-full w-16 h-16 items-center justify-center"
              >
                <View className="bg-red-500 rounded-full w-12 h-12" />
              </Pressable>

              <Pressable
                onPress={closeCamera}
                className="bg-gray-600 rounded-full w-12 h-12 items-center justify-center ml-6"
              >
                <Ionicons name="close" size={20} color="white" />
              </Pressable>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Camera Validation',
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
                  name="camera-outline"
                  size={32}
                  color="#3B82F6"
                />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-black mb-1">
                  Camera Validation
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 leading-6">
              Validate camera functionality and photo capture
            </Text>
          </View>

          {/* Demo Content */}
          <View className="bg-white rounded-2xl p-6 border-2 border-gray-100">
            <Text className="text-lg font-semibold text-black mb-6">
              Camera Controls
            </Text>

            {/* Permission Status */}
            {hasPermission !== null && (
              <View className={`rounded-xl p-4 mb-4 ${hasPermission ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <View className="flex-row items-center">
                  <Ionicons
                    name={hasPermission ? "checkmark-circle" : "alert-circle"}
                    size={24}
                    color={hasPermission ? "#22C55E" : "#EF4444"}
                  />
                  <Text className={`font-medium ml-2 ${hasPermission ? 'text-green-800' : 'text-red-800'}`}>
                    {hasPermission ? 'Camera permission granted' : 'Camera permission denied'}
                  </Text>
                </View>
              </View>
            )}

            {/* Open Camera Button */}
            <Pressable
              onPress={openCamera}
              className="bg-blue-500 rounded-xl py-4 px-6 items-center mb-4 active:bg-blue-600"
            >
              <View className="flex-row items-center">
                <Ionicons name="camera" size={20} color="white" />
                <Text className="text-white font-semibold text-lg ml-2">
                  Open Camera
                </Text>
              </View>
            </Pressable>

            {/* Request Permission Button */}
            {hasPermission === false && (
              <Pressable
                onPress={requestPermissions}
                className="bg-gray-500 rounded-xl py-4 px-6 items-center active:bg-gray-600"
              >
                <Text className="text-white font-semibold text-lg">
                  Request Permission
                </Text>
              </Pressable>
            )}

            {/* Success Message */}
            {photoTaken && (
              <View className="bg-green-50 rounded-xl p-4 border border-green-200 mt-4">
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                  <Text className="text-green-800 font-medium ml-2 flex-1">
                    Photo captured successfully! Camera validation complete.
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
