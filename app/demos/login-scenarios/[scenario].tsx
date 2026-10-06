import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LOGIN_SCENARIOS, LoginScenario } from '@/constants/login-scenarios';

/**
 * Where the flow currently stands. `gate` is the "Login without form" landing state,
 * `credentials` is the one-screen form, and `email`/`password` are the two steps.
 */
type Phase = 'gate' | 'credentials' | 'email' | 'password' | 'success';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClassName =
  'border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 text-black dark:text-white bg-white dark:bg-gray-800';

const initialPhase = (scenario: LoginScenario): Phase => {
  switch (scenario.kind) {
    case 'without-form':
      return 'gate';
    case 'two-step':
      return 'email';
    default:
      return 'credentials';
  }
};

/** Same messages as the web playground, so one test reads the same on both */
const validateEmail = (value: string) => {
  if (!value.trim()) return 'Email is required';
  if (!EMAIL_PATTERN.test(value.trim())) return 'Email must be a valid email address';
  return null;
};

const validatePassword = (value: string) => (value ? null : 'Password is required');

/*
  Coloured text uses plain Text: ThemedText sets an inline theme colour that wins
  over NativeWind colour classes, so red/green/white would render as body text.
*/
function PrimaryButton({
  label,
  testID,
  onPress,
}: {
  label: string;
  testID: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      className="bg-blue-500 p-4 rounded-lg active:bg-blue-600"
    >
      <Text className="text-white text-center font-semibold text-lg">{label}</Text>
    </Pressable>
  );
}

function FieldError({ message, testID }: { message: string | null; testID: string }) {
  if (!message) return null;
  return (
    <Text testID={testID} className="text-sm text-red-600 dark:text-red-400 mt-1">
      {message}
    </Text>
  );
}

export default function LoginScenarioScreen() {
  const { scenario: slug } = useLocalSearchParams<{ scenario: string }>();
  const scenario = LOGIN_SCENARIOS.find((item) => item.slug === slug);

  if (!scenario) {
    return (
      <ThemedView className="flex-1 p-8">
        <Stack.Screen options={{ title: 'Login Scenarios' }} />
        <ThemedText testID="login-scenario-not-found">Unknown login scenario: {slug}</ThemedText>
      </ThemedView>
    );
  }

  return <LoginFlow scenario={scenario} />;
}

function LoginFlow({ scenario }: { scenario: LoginScenario }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>(() => initialPhase(scenario));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const passwordRef = useRef<TextInput>(null);

  const submitCredentials = () => {
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validatePassword(password);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    if (!nextEmailError && !nextPasswordError) setPhase('success');
  };

  const submitEmail = () => {
    const nextEmailError = validateEmail(email);
    setEmailError(nextEmailError);
    if (!nextEmailError) setPhase('password');
  };

  const submitPassword = () => {
    const nextPasswordError = validatePassword(password);
    setPasswordError(nextPasswordError);
    if (!nextPasswordError) setPhase('success');
  };

  const backToAllFlows = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/demos/login-scenarios');
  };

  const showEmail = phase === 'credentials' || phase === 'email';
  const showPassword = phase === 'credentials' || phase === 'password';

  /* Only the credentials form moves focus on Enter; on a step screen it submits the step */
  const onPasswordSubmit = phase === 'password' ? submitPassword : submitCredentials;

  return (
    <ThemedView className="flex-1">
      <Stack.Screen options={{ title: scenario.title }} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-8"
        keyboardShouldPersistTaps="handled"
      >
        {/* Demo Header */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mr-4">
              <Ionicons name={scenario.icon} size={32} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <ThemedText className="text-2xl font-bold mb-1">{scenario.title}</ThemedText>
            </View>
          </View>
          <ThemedText className="text-base text-gray-600 dark:text-gray-400 leading-6">
            {scenario.description}
          </ThemedText>
        </View>

        {/* Demo Content */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
          {phase === 'gate' && (
            <>
              <ThemedText testID="login-gate-message" className="text-xl font-semibold mb-4">
                You need to login to continue
              </ThemedText>
              <PrimaryButton
                label="Login"
                testID="login-gate-button"
                onPress={() => setPhase('credentials')}
              />
            </>
          )}

          {phase === 'credentials' && (
            <ThemedText testID="login-instructions" className="text-base mb-4">
              Enter any email and password.
            </ThemedText>
          )}
          {phase === 'email' && (
            <ThemedText testID="login-step-indicator" className="text-base mb-4">
              Step 1 of 2 — enter your email.
            </ThemedText>
          )}
          {phase === 'password' && (
            <>
              <ThemedText testID="login-step-indicator" className="text-base mb-2">
                Step 2 of 2 — enter your password.
              </ThemedText>
              <ThemedText testID="login-signing-in-as" className="text-base font-medium mb-4">
                Signing in as {email.trim()}
              </ThemedText>
            </>
          )}

          {showEmail && (
            <View className="mb-4">
              <ThemedText className="text-base font-medium mb-2">Email</ThemedText>
              <TextInput
                testID="login-email-input"
                accessibilityLabel="Email"
                value={email}
                onChangeText={setEmail}
                onSubmitEditing={
                  phase === 'email' ? submitEmail : () => passwordRef.current?.focus()
                }
                placeholder="Enter your email"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="username"
                textContentType="username"
                returnKeyType="next"
                submitBehavior="submit"
                className={inputClassName}
              />
              <FieldError message={emailError} testID="login-email-error" />
            </View>
          )}

          {showPassword && (
            <View className="mb-6">
              <ThemedText className="text-base font-medium mb-2">Password</ThemedText>
              <TextInput
                ref={passwordRef}
                /* Step 2 mounts this field fresh, so pick up where Next left off */
                autoFocus={phase === 'password'}
                testID="login-password-input"
                accessibilityLabel="Password"
                value={password}
                onChangeText={setPassword}
                onSubmitEditing={onPasswordSubmit}
                placeholder="Enter your password"
                placeholderTextColor="#666"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="go"
                className={inputClassName}
              />
              <FieldError message={passwordError} testID="login-password-error" />
            </View>
          )}

          {phase === 'email' && (
            <PrimaryButton label="Next" testID="login-next-button" onPress={submitEmail} />
          )}
          {(phase === 'credentials' || phase === 'password') && (
            <PrimaryButton
              label={scenario.submitLabel}
              testID="login-submit-button"
              onPress={phase === 'password' ? submitPassword : submitCredentials}
            />
          )}

          {phase === 'success' && (
            <View
              testID="login-success"
              className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800"
            >
              <View className="flex-row items-center mb-2">
                <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                <Text className="text-green-800 dark:text-green-300 text-lg font-semibold ml-2">
                  Login Successful
                </Text>
              </View>
              <Text testID="login-signed-in-as" className="text-base text-green-800 dark:text-green-300">
                Signed in as {email.trim()}
              </Text>
            </View>
          )}
        </View>

        <Pressable
          testID="login-back-to-flows"
          accessibilityLabel="Back to all flows"
          accessibilityRole="link"
          onPress={backToAllFlows}
          className="items-center py-2"
        >
          <Text className="text-base text-blue-500 font-medium">Back to all flows</Text>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}
