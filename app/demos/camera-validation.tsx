import { View, Text, ScrollView, Pressable, Alert, Image } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { Camera, CameraView } from 'expo-camera';

export default function CameraValidationScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const requestPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const openCamera = async () => {
    let permissionGranted = hasPermission;

    if (hasPermission === null) {
      const { status } = await Camera.requestCameraPermissionsAsync();
      permissionGranted = status === 'granted';
      setHasPermission(permissionGranted);
    }

    if (permissionGranted) {
      setIsCameraActive(true);
      setPhotoUri(null);
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
        setPhotoUri(photo?.uri ?? null);
        setIsCameraActive(false);

        Alert.alert(
          'Photo Taken!',
          'Camera validation successful. Photo captured.',
          [{ text: 'OK' }]
        );
      } catch (error) {
        console.error('Failed to take photo:', error);
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
        {/* Keeps a dark header while the camera is open, independent of the theme */}
        <Stack.Screen
          options={{
            title: 'Camera',
            headerStyle: { backgroundColor: '#000' },
            headerTintColor: '#fff',
          }}
        />
        <CameraView
          testID="camera-view"
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
        >
          <View className="flex-1 justify-end pb-8">
            <View className="flex-row justify-center items-center px-6">
              <Pressable
                testID="camera-shutter-button"
                accessibilityLabel="Take photo"
                accessibilityRole="button"
                onPress={takePhoto}
                className="bg-white rounded-full w-16 h-16 items-center justify-center"
              >
                <View className="bg-red-500 rounded-full w-12 h-12" />
              </Pressable>

              <Pressable
                testID="camera-close-button"
                accessibilityLabel="Close camera"
                accessibilityRole="button"
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
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        {/* Demo Header */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mr-4">
              <Ionicons
                name="camera-outline"
                size={32}
                color="#3B82F6"
              />
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-black dark:text-white mb-1">
                Camera Validation
              </Text>
            </View>
          </View>
          <Text className="text-base text-gray-600 dark:text-gray-400 leading-6">
            Validate camera functionality and photo capture
          </Text>
        </View>

        {/* Demo Content */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
          <Text className="text-lg font-semibold text-black dark:text-white mb-6">
            Camera Controls
          </Text>

          {/* Permission Status */}
          {hasPermission !== null && (
            <View className={`rounded-xl p-4 mb-4 ${hasPermission ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
              <View className="flex-row items-center">
                <Ionicons
                  name={hasPermission ? "checkmark-circle" : "alert-circle"}
                  size={24}
                  color={hasPermission ? "#22C55E" : "#EF4444"}
                />
                <Text
                  testID="camera-permission-status"
                  className={`font-medium ml-2 ${hasPermission ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}
                >
                  {hasPermission ? 'Camera permission granted' : 'Camera permission denied'}
                </Text>
              </View>
            </View>
          )}

          {/* Open Camera Button */}
          <Pressable
            testID="open-camera-button"
            accessibilityLabel="Open Camera"
            accessibilityRole="button"
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
              testID="request-camera-permission-button"
              accessibilityLabel="Request Permission"
              accessibilityRole="button"
              onPress={requestPermissions}
              className="bg-gray-500 rounded-xl py-4 px-6 items-center active:bg-gray-600"
            >
              <Text className="text-white font-semibold text-lg">
                Request Permission
              </Text>
            </Pressable>
          )}

          {/* Success Message */}
          {photoUri && (
            <View
              testID="camera-capture-success"
              className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800 mt-4"
            >
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                <Text className="text-green-800 dark:text-green-200 font-medium ml-2 flex-1">
                  Photo captured successfully! Camera validation complete.
                </Text>
              </View>

              <Image
                testID="camera-photo-preview"
                source={{ uri: photoUri }}
                className="w-full h-56 rounded-xl mt-4"
                resizeMode="cover"
              />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
