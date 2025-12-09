import React, { useState } from 'react';
import { View, ScrollView, Pressable, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

const SAMPLE_PRODUCTS: Product[] = [
  { id: '1', name: 'Wireless Headphones', price: 199.99, description: 'Premium noise-cancelling wireless headphones', category: 'Electronics' },
  { id: '2', name: 'Smart Watch', price: 299.99, description: 'Fitness tracking and notifications', category: 'Electronics' },
  { id: '3', name: 'Coffee Maker', price: 89.99, description: 'Programmable 12-cup coffee maker', category: 'Appliances' },
  { id: '4', name: 'Running Shoes', price: 129.99, description: 'Lightweight athletic running shoes', category: 'Sports' },
  { id: '5', name: 'Backpack', price: 79.99, description: 'Water-resistant laptop backpack', category: 'Accessories' },
  { id: '6', name: 'Desk Lamp', price: 49.99, description: 'LED desk lamp with adjustable brightness', category: 'Home' },
  { id: '7', name: 'Water Bottle', price: 24.99, description: 'Insulated stainless steel water bottle', category: 'Sports' },
  { id: '8', name: 'Notebook', price: 12.99, description: 'Hardcover journal with 200 pages', category: 'Stationery' },
];

export default function ShoppingCartDemo() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartModalVisible, setCartModalVisible] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Add some items to your cart first!');
      return;
    }

    const total = getTotalPrice().toFixed(2);
    Alert.alert(
      'Checkout Complete!',
      `Total: $${total}\n\nThank you for your purchase!`,
      [
        {
          text: 'OK',
          onPress: () => {
            setCart([]);
            setCartModalVisible(false);
          }
        }
      ]
    );
  };

  const renderProductCard = (product: Product) => (
    <View key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 border-2 border-gray-100 dark:border-gray-700">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-4">
          <ThemedText className="text-lg font-bold mb-1">{product.name}</ThemedText>
          <ThemedText className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {product.description}
          </ThemedText>
          <View className="flex-row items-center">
            <View className="bg-blue-100 dark:bg-blue-900/30 rounded-lg px-2 py-1 mr-2">
              <ThemedText className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                {product.category}
              </ThemedText>
            </View>
            <ThemedText className="text-xl font-bold text-green-600 dark:text-green-400">
              ${product.price}
            </ThemedText>
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => addToCart(product)}
        className="bg-blue-500 rounded-xl py-3 px-4 active:bg-blue-600 mt-3"
      >
        <View className="flex-row items-center justify-center">
          <Ionicons name="add-circle-outline" size={18} color="white" />
          <ThemedText className="text-white font-semibold ml-2">Add to Cart</ThemedText>
        </View>
      </Pressable>
    </View>
  );

  const renderCartItem = (item: CartItem) => (
    <View key={item.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-3">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-4">
          <ThemedText className="text-base font-semibold mb-1">{item.name}</ThemedText>
          <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
            ${item.price} each
          </ThemedText>
        </View>
        <ThemedText className="text-lg font-bold text-green-600 dark:text-green-400">
          ${(item.price * item.quantity).toFixed(2)}
        </ThemedText>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center bg-white dark:bg-gray-600 rounded-lg">
          <Pressable
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
            className="px-3 py-2 active:bg-gray-100 dark:active:bg-gray-500 rounded-l-lg"
          >
            <Ionicons name="remove" size={16} color="#6B7280" />
          </Pressable>

          <ThemedText className="px-4 py-2 font-semibold min-w-12 text-center">
            {item.quantity}
          </ThemedText>

          <Pressable
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
            className="px-3 py-2 active:bg-gray-100 dark:active:bg-gray-500 rounded-r-lg"
          >
            <Ionicons name="add" size={16} color="#6B7280" />
          </Pressable>
        </View>

        <Pressable
          onPress={() => removeFromCart(item.id)}
          className="bg-red-500 rounded-lg px-3 py-2 active:bg-red-600"
        >
          <Ionicons name="trash-outline" size={16} color="white" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-4 border-2 border-gray-100 dark:border-gray-700">
        <View className="flex-row items-center mb-4">
          <View className="bg-orange-100 dark:bg-orange-900/30 rounded-xl p-3 mr-4">
            <Ionicons name="basket-outline" size={32} color="#F97316" />
          </View>
          <View className="flex-1">
            <ThemedText className="text-2xl font-bold mb-1">
              Shopping Cart
            </ThemedText>
          </View>
        </View>
        <ThemedText className="text-base text-gray-600 dark:text-gray-400 leading-6">
          Add products to cart, manage quantities, and checkout
        </ThemedText>
      </View>

      {/* Products List */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <ThemedText className="text-xl font-bold mb-4">Products</ThemedText>
        {SAMPLE_PRODUCTS.map(renderProductCard)}
      </ScrollView>

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <Pressable
          onPress={() => setCartModalVisible(true)}
          className="absolute bottom-6 left-6 bg-blue-500 rounded-full w-16 h-16 items-center justify-center shadow-lg active:bg-blue-600"
        >
          <View className="relative">
            <Ionicons name="basket" size={28} color="white" />
            <View className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-6 h-6 items-center justify-center px-1">
              <ThemedText className="text-white text-xs font-bold">
                {getTotalItems()}
              </ThemedText>
            </View>
          </View>
        </Pressable>
      )}

      {/* Cart Modal */}
      <Modal
        visible={cartModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCartModalVisible(false)}
      >
        <ThemedView className="flex-1">
          {/* Cart Header */}
          <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="basket" size={24} color="#3B82F6" />
                <ThemedText className="text-xl font-bold ml-3">
                  Shopping Cart ({getTotalItems()})
                </ThemedText>
              </View>
              <Pressable
                onPress={() => setCartModalVisible(false)}
                className="p-2 active:bg-gray-100 dark:active:bg-gray-700 rounded-full"
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </Pressable>
            </View>
          </View>

          {/* Cart Items */}
          <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
            {cart.length === 0 ? (
              <View className="items-center justify-center py-12">
                <Ionicons name="basket-outline" size={64} color="#D1D5DB" />
                <ThemedText className="text-gray-500 dark:text-gray-400 text-lg mt-4">
                  Your cart is empty
                </ThemedText>
                <ThemedText className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                  Add some products to get started
                </ThemedText>
              </View>
            ) : (
              <>
                {cart.map(renderCartItem)}

                {/* Total */}
                <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mt-4">
                  <View className="flex-row justify-between items-center">
                    <ThemedText className="text-lg font-bold">Total</ThemedText>
                    <ThemedText className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${getTotalPrice().toFixed(2)}
                    </ThemedText>
                  </View>
                </View>
              </>
            )}
          </ScrollView>

          {/* Checkout Button */}
          {cart.length > 0 && (
            <View className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <Pressable
                onPress={handleCheckout}
                className="bg-green-500 rounded-xl py-4 px-6 active:bg-green-600"
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="card-outline" size={20} color="white" />
                  <ThemedText className="text-white font-bold text-lg ml-2">
                    Checkout (${getTotalPrice().toFixed(2)})
                  </ThemedText>
                </View>
              </Pressable>
            </View>
          )}
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}