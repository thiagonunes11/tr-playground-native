import React, { useState } from 'react';
import { View, TextInput, Pressable, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

interface ListItem {
  id: string;
  text: string;
}

export default function DeleteElementsDemo() {
  const [items, setItems] = useState<ListItem[]>([
    { id: '1', text: 'Sample Item 1' },
    { id: '2', text: 'Sample Item 2' },
    { id: '3', text: 'Sample Item 3' },
  ]);
  const [newItemText, setNewItemText] = useState('');
  const [lastAction, setLastAction] = useState('');

  const addItem = () => {
    if (newItemText.trim() === '') {
      Alert.alert('Error', 'Please enter some text to add an item');
      return;
    }

    const newItem: ListItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
    };

    setItems(prev => [...prev, newItem]);
    setNewItemText('');
    setLastAction(`Added: "${newItem.text}"`);
  };

  const deleteItem = (id: string) => {
    const itemToDelete = items.find(item => item.id === id);
    setItems(prev => prev.filter(item => item.id !== id));
    setLastAction(`Deleted: "${itemToDelete?.text}"`);
  };

  const renderItem = ({ item }: { item: ListItem }) => (
    <View className="flex-row items-center justify-between p-3 mb-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
      <ThemedText className="flex-1 text-base">{item.text}</ThemedText>
      <Pressable
        onPress={() => deleteItem(item.id)}
        className="w-8 h-8 bg-red-500 rounded-full items-center justify-center active:bg-red-600"
      >
        <ThemedText className="text-white font-bold text-lg">×</ThemedText>
      </Pressable>
    </View>
  );

  return (
    <ThemedView className="flex-1 p-8">
      {/* Demo Header */}
      <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
        <View className="flex-row items-center mb-4">
          <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mr-4">
            <Ionicons
              name="trash-outline"
              size={32}
              color="#3B82F6"
            />
          </View>
          <View className="flex-1">
            <ThemedText className="text-2xl font-bold mb-1">
              Delete Elements
            </ThemedText>
          </View>
        </View>
        <ThemedText className="text-base text-gray-600 dark:text-gray-400 leading-6">
          Add and delete elements from a list
        </ThemedText>
      </View>

      {/* Demo Content */}
      <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
        <ThemedText className="text-lg font-semibold mb-4">
          Add New Element
        </ThemedText>
        <View className="flex-row mb-6">
          <TextInput
            value={newItemText}
            onChangeText={setNewItemText}
            placeholder="Enter text for new element"
            placeholderTextColor="#666"
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-800"
          />
          <Pressable
            onPress={addItem}
            className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center active:bg-blue-600 ml-6"
          >
            <ThemedText className="text-white font-bold text-xl">+</ThemedText>
          </Pressable>
        </View>

        {/* Items list */}
        <View className="min-h-[200px]">
          <ThemedText className="text-lg font-semibold mb-2">
            Elements ({items.length})
          </ThemedText>

          {items.length === 0 ? (
            <View className="justify-center items-center py-8">
              <ThemedText className="text-gray-500 text-center">
                No elements yet. Add some using the input above.
              </ThemedText>
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 300 }}
            />
          )}
        </View>
      </View>

      {/* Last action feedback */}
      {lastAction && (
        <View className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <ThemedText className="text-center text-green-800 dark:text-green-200">
            {lastAction}
          </ThemedText>
        </View>
      )}

      <View className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <ThemedText className="text-sm text-center">
          Click the × buttons to remove elements, or use the input field to add new ones.
        </ThemedText>
      </View>
    </ThemedView>
  );
}