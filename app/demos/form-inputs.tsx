import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

const COUNTRIES = [
  { value: '', label: 'Select a country' },
  { value: 'brazil', label: 'Brazil' },
  { value: 'canada', label: 'Canada' },
  { value: 'germany', label: 'Germany' },
  { value: 'india', label: 'India' },
  { value: 'united-states', label: 'United States' },
] as const;

const inputClassName =
  'border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 text-black dark:text-white bg-white dark:bg-gray-800';

export default function FormInputsDemo() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [country, setCountry] = useState('');

  /** Proves the `enter` command reached the field, even when nothing else changes */
  const [lastSubmittedField, setLastSubmittedField] = useState('');
  const [enterCount, setEnterCount] = useState(0);
  const [summary, setSummary] = useState<string | null>(null);

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleEnter = (fieldLabel: string, focusNext?: () => void) => {
    setLastSubmittedField(fieldLabel);
    setEnterCount((count) => count + 1);
    focusNext?.();
  };

  /** Empty while the placeholder row is selected, so the label below reads "none" */
  const selectedCountryLabel = country
    ? (COUNTRIES.find((option) => option.value === country)?.label ?? '')
    : '';

  const handleSubmit = () => {
    const missing: string[] = [];
    if (!fullName.trim()) missing.push('Full Name');
    if (!email.trim()) missing.push('Email');
    if (!country) missing.push('Country');

    if (missing.length > 0) {
      setSummary(`Missing required fields: ${missing.join(', ')}`);
      return;
    }

    setSummary(`${fullName.trim()} from ${selectedCountryLabel} registered successfully!`);
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-8"
        keyboardShouldPersistTaps="handled"
      >
        {/* Demo Header */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mr-4">
              <Ionicons name="create-outline" size={32} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <ThemedText className="text-2xl font-bold mb-1">Form Inputs</ThemedText>
            </View>
          </View>
          <ThemedText className="text-base text-gray-600 dark:text-gray-400 leading-6">
            Native text fields and a native dropdown in a single registration form. Type into the
            inputs, press the keyboard Enter/Return key, and pick a country from the dropdown.
          </ThemedText>
        </View>

        {/* Text Inputs */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
          <ThemedText className="text-lg font-semibold mb-4">Text Inputs</ThemedText>

          <View className="mb-4">
            <ThemedText className="text-base font-medium mb-2">Full Name</ThemedText>
            <TextInput
              testID="form-name-input"
              accessibilityLabel="Full Name"
              value={fullName}
              onChangeText={setFullName}
              onSubmitEditing={() => handleEnter('Full Name', () => emailRef.current?.focus())}
              placeholder="Enter your full name"
              placeholderTextColor="#666"
              returnKeyType="next"
              submitBehavior="submit"
              autoCapitalize="words"
              className={inputClassName}
            />
          </View>

          <View className="mb-4">
            <ThemedText className="text-base font-medium mb-2">Email</ThemedText>
            <TextInput
              ref={emailRef}
              testID="form-email-input"
              accessibilityLabel="Email"
              value={email}
              onChangeText={setEmail}
              onSubmitEditing={() => handleEnter('Email', () => phoneRef.current?.focus())}
              placeholder="Enter your email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              returnKeyType="next"
              submitBehavior="submit"
              autoCapitalize="none"
              className={inputClassName}
            />
          </View>

          <View className="mb-4">
            <ThemedText className="text-base font-medium mb-2">Phone</ThemedText>
            <TextInput
              ref={phoneRef}
              testID="form-phone-input"
              accessibilityLabel="Phone"
              value={phone}
              onChangeText={setPhone}
              onSubmitEditing={() => handleEnter('Phone')}
              placeholder="Enter your phone number"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              returnKeyType="done"
              className={inputClassName}
            />
          </View>

          {/* Multiline field: Enter inserts a line break instead of submitting */}
          <View className="mb-4">
            <ThemedText className="text-base font-medium mb-2">Notes (multiline)</ThemedText>
            <TextInput
              testID="form-notes-input"
              accessibilityLabel="Notes"
              value={notes}
              onChangeText={setNotes}
              placeholder="Press Enter here to add a new line"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className={`${inputClassName} h-24`}
            />
            <ThemedText testID="form-notes-line-count" className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Lines: {notes.split('\n').length}
            </ThemedText>
          </View>

          <View className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <ThemedText testID="form-enter-count" className="text-base font-medium">
              Enter pressed: {enterCount}
            </ThemedText>
            <ThemedText testID="form-last-submitted-field" className="text-base">
              Last submitted field: {lastSubmittedField || 'none'}
            </ThemedText>
          </View>
        </View>

        {/* Dropdown */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
          <ThemedText className="text-lg font-semibold mb-4">Dropdown</ThemedText>

          <ThemedText className="text-base font-medium mb-2">Country</ThemedText>
          <View className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden mb-4">
            <Picker
              testID="form-country-picker"
              accessibilityLabel="Country"
              selectedValue={country}
              onValueChange={(value) => setCountry(String(value))}
              /* Renders an android.widget.Spinner instead of the iOS-style wheel */
              mode="dropdown"
              dropdownIconColor={isDark ? '#FFFFFF' : '#000000'}
              style={{
                color: isDark ? '#FFFFFF' : '#000000',
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
              }}
            >
              {/*
                The open popup is drawn with Android's own theme, which follows the
                OS instead of the in-app toggle, so each row sets its background as
                well as its text colour — colouring only the text leaves black on
                black whenever the two disagree.
              */}
              {COUNTRIES.map((option) => (
                <Picker.Item
                  key={option.value || 'placeholder'}
                  label={option.label}
                  value={option.value}
                  style={{
                    color: isDark ? '#FFFFFF' : '#000000',
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                  }}
                />
              ))}
            </Picker>
          </View>

          <View className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <ThemedText testID="form-selected-country" className="text-base font-medium">
              Selected country: {selectedCountryLabel || 'none'}
            </ThemedText>
          </View>
        </View>

        {/* Submit */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
          <Pressable
            testID="form-submit-button"
            accessibilityLabel="Register"
            accessibilityRole="button"
            onPress={handleSubmit}
            className="bg-blue-500 p-4 rounded-lg active:bg-blue-600"
          >
            <ThemedText className="text-white text-center font-semibold text-lg">Register</ThemedText>
          </Pressable>

          {summary && (
            <ThemedText
              testID="form-submit-summary"
              className="text-center font-medium mt-4 text-green-600 dark:text-green-400"
            >
              {summary}
            </ThemedText>
          )}
        </View>

        <View className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <ThemedText className="text-sm text-center">
            The single-line fields react to the keyboard Enter/Return key and move focus forward.
            The Notes field keeps the Enter key as a line break.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
