import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

interface LocationResult {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

function toLocationResult(position: Location.LocationObject): LocationResult {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
  };
}

function validateLocation(location: LocationResult): { valid: boolean; message: string } {
  const { latitude, longitude, accuracy } = location;

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return { valid: false, message: 'Coordinates must be valid numbers.' };
  }

  if (latitude < -90 || latitude > 90) {
    return { valid: false, message: 'Latitude must be between -90 and 90.' };
  }

  if (longitude < -180 || longitude > 180) {
    return { valid: false, message: 'Longitude must be between -180 and 180.' };
  }

  if (accuracy !== null && accuracy <= 0) {
    return { valid: false, message: 'Accuracy must be greater than zero meters.' };
  }

  return {
    valid: true,
    message: 'Location validated successfully. Coordinates are within expected ranges.',
  };
}

function getLocationErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes('location services are enabled') || message.includes('unavailable')) {
    return Platform.OS === 'android'
      ? 'Location unavailable. On emulators, open Extended Controls (⋯) → Location, set a mock coordinate, then try again.'
      : 'Location unavailable. Enable location services in device Settings, then try again.';
  }

  return 'Failed to retrieve location. Please try again.';
}

async function ensureLocationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
  if (existingStatus === 'granted') {
    return true;
  }

  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

async function fetchDeviceLocation(): Promise<LocationResult> {
  const servicesEnabled = await Location.hasServicesEnabledAsync();
  if (!servicesEnabled) {
    throw new Error('Location services are disabled on this device.');
  }

  if (Platform.OS === 'android') {
    try {
      await Location.enableNetworkProviderAsync();
    } catch {
      // Continue if the user declines or the provider is already enabled.
    }
  }

  const lastKnown = await Location.getLastKnownPositionAsync({
    maxAge: 300_000,
    requiredAccuracy: 5000,
  });
  if (lastKnown) {
    return toLocationResult(lastKnown);
  }

  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return toLocationResult(position);
  } catch {
    const fallback = await Location.getLastKnownPositionAsync();
    if (fallback) {
      return toLocationResult(fallback);
    }
    throw new Error('Current location is unavailable. Make sure that location services are enabled');
  }
}

export default function GeoLocationScreen() {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [servicesEnabled, setServicesEnabled] = useState<boolean | null>(null);
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    ensureLocationPermission().then(setPermissionGranted);
    Location.hasServicesEnabledAsync().then(setServicesEnabled);
  }, []);

  const handleGetLocation = async () => {
    setIsLoading(true);
    setLocation(null);
    setValidationMessage(null);
    setIsValid(null);

    try {
      const granted = await ensureLocationPermission();
      setPermissionGranted(granted);

      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Location permission is required to run this demo.',
          [{ text: 'OK' }]
        );
        return;
      }

      const enabled = await Location.hasServicesEnabledAsync();
      setServicesEnabled(enabled);

      if (!enabled) {
        const message =
          'Location services are disabled. Enable GPS/location in device settings and try again.';
        setIsValid(false);
        setValidationMessage(message);
        Alert.alert('Location Services Disabled', message, [{ text: 'OK' }]);
        return;
      }

      const result = await fetchDeviceLocation();
      const validation = validateLocation(result);
      setLocation(result);
      setIsValid(validation.valid);
      setValidationMessage(validation.message);
    } catch (error) {
      const message = getLocationErrorMessage(error);
      setIsValid(false);
      setValidationMessage(message);
      Alert.alert('Location Unavailable', message, [{ text: 'OK' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Geo Location',
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#000',
        }}
      />
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-6">
          <View className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 rounded-xl p-3 mr-4">
                <Ionicons name="location-outline" size={32} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-black mb-1">
                  Geo Location
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 leading-6">
              Enable geolocation and validate that the device returns valid coordinates.
            </Text>
          </View>

          {Platform.OS === 'android' && (
            <View className="bg-blue-50 rounded-2xl p-4 mb-6 border-2 border-blue-100">
              <View className="flex-row items-start">
                <Ionicons name="information-circle-outline" size={22} color="#3B82F6" />
                <Text className="text-blue-800 text-sm leading-5 ml-3 flex-1">
                  On Android emulators, set a mock location via Extended Controls (⋯) →
                  Location before tapping Get Location.
                </Text>
              </View>
            </View>
          )}

          <View className="bg-white rounded-2xl p-6 border-2 border-gray-100">
            <Text className="text-lg font-semibold text-black mb-4">
              Get Current Location
            </Text>

            {permissionGranted !== null && (
              <View
                className={`rounded-xl p-4 mb-4 ${
                  permissionGranted
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name={permissionGranted ? 'checkmark-circle' : 'alert-circle'}
                    size={24}
                    color={permissionGranted ? '#22C55E' : '#EF4444'}
                  />
                  <Text
                    className={`font-medium ml-2 ${
                      permissionGranted ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {permissionGranted
                      ? 'Location permission granted'
                      : 'Location permission denied'}
                  </Text>
                </View>
              </View>
            )}

            {servicesEnabled !== null && (
              <View
                className={`rounded-xl p-4 mb-4 ${
                  servicesEnabled
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-amber-50 border border-amber-200'
                }`}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name={servicesEnabled ? 'navigate-circle' : 'warning-outline'}
                    size={24}
                    color={servicesEnabled ? '#22C55E' : '#D97706'}
                  />
                  <Text
                    className={`font-medium ml-2 flex-1 ${
                      servicesEnabled ? 'text-green-800' : 'text-amber-800'
                    }`}
                  >
                    {servicesEnabled
                      ? 'Location services enabled'
                      : 'Location services disabled — enable GPS in device settings'}
                  </Text>
                </View>
              </View>
            )}

            <Pressable
              testID="get-location-button"
              accessibilityLabel="Get current location"
              onPress={handleGetLocation}
              disabled={isLoading}
              className={`rounded-xl py-4 px-6 items-center flex-row justify-center ${
                isLoading ? 'bg-gray-400' : 'bg-blue-500 active:bg-blue-600'
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="navigate" size={24} color="#fff" />
              )}
              <Text className="text-white font-semibold text-lg ml-2">
                {isLoading ? 'Getting Location...' : 'Get Location'}
              </Text>
            </Pressable>

            {location && (
              <View className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <Text className="text-sm text-gray-600 mb-3">Current coordinates:</Text>
                <Text testID="location-latitude" className="text-base text-black mb-1">
                  Latitude: {location.latitude.toFixed(6)}
                </Text>
                <Text testID="location-longitude" className="text-base text-black mb-1">
                  Longitude: {location.longitude.toFixed(6)}
                </Text>
                {location.accuracy !== null && (
                  <Text testID="location-accuracy" className="text-sm text-gray-600">
                    Accuracy: ±{location.accuracy.toFixed(1)} meters
                  </Text>
                )}
              </View>
            )}

            {validationMessage && isValid !== null && (
              <View
                className={`rounded-xl p-4 border mt-4 ${
                  isValid
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name={isValid ? 'checkmark-circle' : 'close-circle'}
                    size={24}
                    color={isValid ? '#22C55E' : '#EF4444'}
                  />
                  <Text
                    testID="location-validation-message"
                    className={`font-medium ml-2 flex-1 ${
                      isValid ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {validationMessage}
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
