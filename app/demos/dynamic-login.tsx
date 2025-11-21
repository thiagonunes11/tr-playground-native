import React, { useState } from 'react';
import { View, TextInput, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

const buttonTexts = [
  'Log in',
  'Sign in',
  'Submit',
  'Enter',
  'Continue',
  'Go',
  'Next',
  'Proceed',
  'Access',
  'Login'
];

export default function DynamicLoginDemo() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentButtonText, setCurrentButtonText] = useState(() => 
    buttonTexts[Math.floor(Math.random() * buttonTexts.length)]
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in both email and password fields');
      return;
    }

    setIsLoggedIn(true);
  };

  return (
    <ThemedView className="flex-1 p-8">
      {/* Demo Header */}
      <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
        <View className="flex-row items-center mb-4">
          <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mr-4">
            <Ionicons
              name="key-outline"
              size={32}
              color="#3B82F6"
            />
          </View>
          <View className="flex-1">
            <ThemedText className="text-2xl font-bold mb-1">
              Dynamic Login Text
            </ThemedText>
          </View>
        </View>
        <ThemedText className="text-base text-gray-600 dark:text-gray-400 leading-6">
          Login form with a randomly selected button text. Enter credentials and sign in successfully!
        </ThemedText>
      </View>

      {/* Demo Content */}
      <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
        <ThemedText className="text-lg font-semibold mb-4">
          Login Form
        </ThemedText>

        {/* Email Input */}
        <View className="mb-4">
          <ThemedText className="text-base font-medium mb-2">Email</ThemedText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 text-black dark:text-white bg-white dark:bg-gray-800"
          />
        </View>

        {/* Password Input */}
        <View className="mb-6">
          <ThemedText className="text-base font-medium mb-2">Password</ThemedText>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#666"
            secureTextEntry
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 text-black dark:text-white bg-white dark:bg-gray-800"
          />
        </View>

        {/* Dynamic Submit Button */}
        <Pressable
          onPress={handleSubmit}
          className="bg-blue-500 p-4 rounded-lg active:bg-blue-600 mb-2"
        >
          <ThemedText className="text-white text-center font-semibold text-lg">
            {currentButtonText}
          </ThemedText>
        </Pressable>

        {/* Validation Text */}
        {isLoggedIn && (
          <ThemedText className="text-center text-green-600 dark:text-green-400 font-medium">
            Successfully signed in!
          </ThemedText>
        )}
      </View>

      <View className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <ThemedText className="text-sm text-center">
          Notice the random button text when you open this page. Fill in the fields and sign in successfully!
        </ThemedText>
      </View>
    </ThemedView>
  );
}