import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { Stack } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState, Platform, Pressable, ScrollView, Text, View } from 'react-native';

type BiometricStatus = {
  hasHardware: boolean;
  isEnrolled: boolean;
  securityLevel: LocalAuthentication.SecurityLevel;
  supportedTypes: LocalAuthentication.AuthenticationType[];
};

type AuthenticationAttempt = {
  mode: 'biometric-only' | 'with-device-credential';
  result: LocalAuthentication.LocalAuthenticationResult;
  timestamp: string;
};

const AUTHENTICATION_TYPE_LABELS: Record<LocalAuthentication.AuthenticationType, string> = {
  [LocalAuthentication.AuthenticationType.FINGERPRINT]:
    Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint',
  [LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION]:
    Platform.OS === 'ios' ? 'Face ID' : 'Face recognition',
  [LocalAuthentication.AuthenticationType.IRIS]: 'Iris',
};

const SECURITY_LEVEL_LABELS: Record<LocalAuthentication.SecurityLevel, string> = {
  [LocalAuthentication.SecurityLevel.NONE]: 'None',
  [LocalAuthentication.SecurityLevel.SECRET]: 'Device credential only',
  [LocalAuthentication.SecurityLevel.BIOMETRIC_WEAK]: 'Weak biometric',
  [LocalAuthentication.SecurityLevel.BIOMETRIC_STRONG]: 'Strong biometric',
};

function StatusRow({ label, value, testID }: { label: string; value: string; testID: string }) {
  return (
    <View className="flex-row justify-between items-start py-3 border-b border-gray-100">
      <Text className="text-gray-600 flex-1 mr-4">{label}</Text>
      <Text testID={testID} className="text-black font-semibold text-right flex-1">
        {value}
      </Text>
    </View>
  );
}

export default function BiometricAuthenticationScreen() {
  const [status, setStatus] = useState<BiometricStatus | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<AuthenticationAttempt | null>(null);

  const refreshStatus = useCallback(async () => {
    setIsRefreshing(true);
    setStatusError(null);

    try {
      const [hasHardware, isEnrolled, securityLevel, supportedTypes] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
        LocalAuthentication.getEnrolledLevelAsync(),
        LocalAuthentication.supportedAuthenticationTypesAsync(),
      ]);

      setStatus({ hasHardware, isEnrolled, securityLevel, supportedTypes });
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : 'Unable to read biometric status');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refreshStatus();

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        refreshStatus();
      }
    });

    return () => subscription.remove();
  }, [refreshStatus]);

  const biometricNames = useMemo(() => {
    if (!status?.supportedTypes.length) {
      return 'None detected';
    }

    return status.supportedTypes.map((type) => AUTHENTICATION_TYPE_LABELS[type]).join(', ');
  }, [status]);

  const primaryBiometricName = useMemo(() => {
    if (status?.supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return Platform.OS === 'ios' ? 'Face ID' : 'face recognition';
    }

    if (status?.supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return Platform.OS === 'ios' ? 'Touch ID' : 'fingerprint';
    }

    return 'biometrics';
  }, [status]);

  const authenticate = async (mode: AuthenticationAttempt['mode']) => {
    setIsAuthenticating(true);
    setLastAttempt(null);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Authenticate with ${primaryBiometricName}`,
        cancelLabel: 'Cancel',
        fallbackLabel: mode === 'with-device-credential' ? 'Use Passcode' : '',
        disableDeviceFallback: mode === 'biometric-only',
      });

      setLastAttempt({ mode, result, timestamp: new Date().toISOString() });
    } catch (error) {
      setLastAttempt({
        mode,
        result: {
          success: false,
          error: 'unknown',
          warning: error instanceof Error ? error.message : 'Unexpected authentication error',
        },
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsAuthenticating(false);
      refreshStatus();
    }
  };

  const lastAttemptError = lastAttempt && !lastAttempt.result.success
    ? lastAttempt.result.error
    : null;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Biometric Authentication',
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#000',
        }}
      />
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-6">
          <View className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 rounded-xl p-3 mr-4">
                <Ionicons name="finger-print-outline" size={32} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-black mb-1">
                  Biometric Authentication
                </Text>
                <Text testID="biometric-platform" className="text-sm font-medium text-blue-600">
                  {Platform.OS === 'ios' ? 'iOS: Face ID or Touch ID' : 'Android: system biometrics'}
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 leading-6">
              Validate biometric availability and native authentication outcomes on both platforms.
            </Text>
          </View>

          <View className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-100">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold text-black">Device Status</Text>
              <Pressable
                testID="refresh-biometric-status"
                accessibilityLabel="Refresh biometric status"
                onPress={refreshStatus}
                disabled={isRefreshing}
                className="bg-gray-100 rounded-lg px-3 py-2 active:bg-gray-200"
              >
                <Text className="text-blue-600 font-semibold">
                  {isRefreshing ? 'Checking...' : 'Refresh'}
                </Text>
              </Pressable>
            </View>

            <StatusRow label="Hardware available" value={status ? (status.hasHardware ? 'Yes' : 'No') : 'Checking...'} testID="biometric-hardware-status" />
            <StatusRow label="Biometrics enrolled" value={status ? (status.isEnrolled ? 'Yes' : 'No') : 'Checking...'} testID="biometric-enrollment-status" />
            <StatusRow label="Supported types" value={status ? biometricNames : 'Checking...'} testID="biometric-supported-types" />
            <StatusRow label="Enrolled security level" value={status ? SECURITY_LEVEL_LABELS[status.securityLevel] : 'Checking...'} testID="biometric-security-level" />

            {statusError && (
              <View testID="biometric-status-error" className="bg-red-50 rounded-xl p-4 border border-red-200 mt-4">
                <Text className="text-red-800">{statusError}</Text>
              </View>
            )}
          </View>

          <View className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-100">
            <Text className="text-lg font-semibold text-black mb-2">Authentication Scenarios</Text>
            <Text className="text-sm text-gray-600 leading-5 mb-5">
              The buttons remain available when biometrics are absent so QA can validate native error results.
            </Text>

            <Pressable
              testID="authenticate-biometric-only"
              accessibilityLabel="Authenticate with biometrics only"
              onPress={() => authenticate('biometric-only')}
              disabled={isAuthenticating}
              className={`rounded-xl py-4 px-6 items-center mb-3 ${isAuthenticating ? 'bg-gray-400' : 'bg-blue-500 active:bg-blue-600'}`}
            >
              <View className="flex-row items-center">
                <Ionicons name="finger-print" size={22} color="#fff" />
                <Text className="text-white font-semibold text-base ml-2">
                  {isAuthenticating ? 'Authenticating...' : 'Biometrics Only'}
                </Text>
              </View>
            </Pressable>

            <Pressable
              testID="authenticate-with-fallback"
              accessibilityLabel="Authenticate with device credential fallback"
              onPress={() => authenticate('with-device-credential')}
              disabled={isAuthenticating}
              className={`rounded-xl py-4 px-6 items-center ${isAuthenticating ? 'bg-gray-400' : 'bg-gray-700 active:bg-gray-800'}`}
            >
              <View className="flex-row items-center">
                <Ionicons name="keypad-outline" size={22} color="#fff" />
                <Text className="text-white font-semibold text-base ml-2">
                  Biometrics or Device Credential
                </Text>
              </View>
            </Pressable>
          </View>

          {lastAttempt && (
            <View
              testID="biometric-authentication-result"
              className={`rounded-2xl p-6 mb-6 border-2 ${lastAttempt.result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
            >
              <View className="flex-row items-center mb-4">
                <Ionicons name={lastAttempt.result.success ? 'checkmark-circle' : 'close-circle'} size={28} color={lastAttempt.result.success ? '#16A34A' : '#DC2626'} />
                <Text testID="biometric-result-status" className={`text-xl font-bold ml-2 ${lastAttempt.result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {lastAttempt.result.success ? 'Authentication succeeded' : 'Authentication failed'}
                </Text>
              </View>
              <StatusRow label="Mode" value={lastAttempt.mode === 'biometric-only' ? 'Biometrics only' : 'With device credential'} testID="biometric-result-mode" />
              <StatusRow label="Result code" value={lastAttempt.result.success ? 'success' : lastAttemptError ?? 'unknown'} testID="biometric-result-code" />
              <StatusRow label="Timestamp" value={lastAttempt.timestamp} testID="biometric-result-timestamp" />
              {!lastAttempt.result.success && lastAttempt.result.warning && (
                <Text testID="biometric-result-warning" className="text-red-700 mt-3">
                  {lastAttempt.result.warning}
                </Text>
              )}
            </View>
          )}

          <View className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
            <Text className="text-blue-900 font-semibold mb-2">Simulator / emulator testing</Text>
            <Text className="text-blue-800 leading-5">
              {Platform.OS === 'ios'
                ? 'Use Simulator → Features → Face ID or Touch ID to change enrollment and trigger matching or non-matching authentication.'
                : 'Enroll a fingerprint in the emulator settings, then use the emulator fingerprint controls to send matching or unknown fingerprints.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
