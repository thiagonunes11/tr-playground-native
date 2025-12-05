import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

const API_URL = 'https://tr-playground-api.onrender.com';

interface ApiResponse {
  code?: string;
  timestamp?: string;
  lastPost?: any;
  lastPostTimestamp?: string;
  lastPut?: any;
  lastPutTimestamp?: string;
  lastPatch?: any;
  lastPatchTimestamp?: string;
  isDeleted?: boolean;
  lastDeleteTimestamp?: string;
  error?: string;
}

export default function ApiValidationDemo() {
  // GET /code
  const [code, setCode] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [getError, setGetError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // POST /echo
  const [lastPost, setLastPost] = useState<any>(null);
  const [lastPostTimestamp, setLastPostTimestamp] = useState<string | null>(null);

  // PUT /update
  const [lastPut, setLastPut] = useState<any>(null);
  const [lastPutTimestamp, setLastPutTimestamp] = useState<string | null>(null);

  // PATCH /modify
  const [lastPatch, setLastPatch] = useState<any>(null);
  const [lastPatchTimestamp, setLastPatchTimestamp] = useState<string | null>(null);

  // DELETE /delete
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [lastDeleteTimestamp, setLastDeleteTimestamp] = useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  // Fetch code on load
  useEffect(() => {
    fetchCode();
    // Reset delete status
    fetch(`${API_URL}/reset-delete`).catch(() => {});
  }, []);

  // Polling for last POST
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${API_URL}/last-post`)
        .then((res) => res.json())
        .then((data: ApiResponse) => {
          setLastPost(data.lastPost);
          setLastPostTimestamp(data.lastPostTimestamp || null);
        })
        .catch(() => {});
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Polling for last PUT
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${API_URL}/last-put`)
        .then((res) => res.json())
        .then((data: ApiResponse) => {
          setLastPut(data.lastPut);
          setLastPutTimestamp(data.lastPutTimestamp || null);
        })
        .catch(() => {});
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Polling for last PATCH
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${API_URL}/last-patch`)
        .then((res) => res.json())
        .then((data: ApiResponse) => {
          setLastPatch(data.lastPatch);
          setLastPatchTimestamp(data.lastPatchTimestamp || null);
        })
        .catch(() => {});
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Polling for delete status
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${API_URL}/last-delete`)
        .then((res) => res.json())
        .then((data: ApiResponse) => {
          setIsDeleted(data.isDeleted || false);
          setLastDeleteTimestamp(data.lastDeleteTimestamp || null);
        })
        .catch(() => {});
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchCode = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/code`);
      const data: ApiResponse = await response.json();
      setCode(data.code || '');
      setTimestamp(data.timestamp || null);
      setGetError('');
    } catch (error) {
      setGetError('Error fetching code');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCode();
    setRefreshing(false);
  };

  const formatTimestamp = (ts: string | null) => {
    if (!ts) return '';
    return new Date(ts).toLocaleString();
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Demo Header */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-4 border-2 border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <View className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-3 mr-4">
              <Ionicons name="cloud-outline" size={32} color="#A855F7" />
            </View>
            <View className="flex-1">
              <ThemedText className="text-2xl font-bold mb-1">
                API Validation
              </ThemedText>
            </View>
          </View>
          <ThemedText className="text-sm text-gray-600 dark:text-gray-400 leading-5 mb-2">
            Test various HTTP methods with a real API
          </ThemedText>
          <ThemedText className="text-xs text-gray-500 dark:text-gray-500 leading-4">
            API: {API_URL}
          </ThemedText>
          <ThemedText className="text-xs text-yellow-600 dark:text-yellow-500 mt-2">
            Note: First request may be slow due to cold start
          </ThemedText>
        </View>

        {/* GET /code Card */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border-2 border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-3">
            <View className="bg-green-100 dark:bg-green-900/30 rounded-lg px-3 py-1 mr-3">
              <ThemedText className="text-green-700 dark:text-green-300 font-bold text-xs">
                GET
              </ThemedText>
            </View>
            <ThemedText className="text-lg font-bold flex-1">/code</ThemedText>
          </View>

          <View className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
            <ThemedText className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Current code:
            </ThemedText>
            {loading ? (
              <ActivityIndicator size="small" color="#3B82F6" />
            ) : (
              <>
                <ThemedText className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {code}
                </ThemedText>
                {timestamp && (
                  <ThemedText className="text-xs text-gray-500 dark:text-gray-500">
                    {formatTimestamp(timestamp)}
                  </ThemedText>
                )}
              </>
            )}
          </View>

          <Pressable
            onPress={fetchCode}
            className="bg-blue-500 rounded-xl py-3 px-6 active:bg-blue-600"
            disabled={loading}
          >
            <ThemedText className="text-white text-center font-semibold">
              {loading ? 'Loading...' : 'Refresh Code'}
            </ThemedText>
          </Pressable>

          {getError && (
            <ThemedText className="text-red-500 text-sm mt-3">{getError}</ThemedText>
          )}
        </View>

        {/* POST /echo Card */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border-2 border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-3">
            <View className="bg-blue-100 dark:bg-blue-900/30 rounded-lg px-3 py-1 mr-3">
              <ThemedText className="text-blue-700 dark:text-blue-300 font-bold text-xs">
                POST
              </ThemedText>
            </View>
            <ThemedText className="text-lg font-bold flex-1">/echo</ThemedText>
          </View>

          <View className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <ThemedText className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Last POST received:
            </ThemedText>
            {lastPost ? (
              <>
                <ThemedText className="text-xs font-mono text-gray-800 dark:text-gray-200">
                  {JSON.stringify(lastPost, null, 2)}
                </ThemedText>
                {lastPostTimestamp && (
                  <ThemedText className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {formatTimestamp(lastPostTimestamp)}
                  </ThemedText>
                )}
              </>
            ) : (
              <ThemedText className="text-sm text-gray-500 dark:text-gray-500 italic">
                No POST received yet
              </ThemedText>
            )}
          </View>
        </View>

        {/* PUT /update Card */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border-2 border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-3">
            <View className="bg-orange-100 dark:bg-orange-900/30 rounded-lg px-3 py-1 mr-3">
              <ThemedText className="text-orange-700 dark:text-orange-300 font-bold text-xs">
                PUT
              </ThemedText>
            </View>
            <ThemedText className="text-lg font-bold flex-1">/update</ThemedText>
          </View>

          <View className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <ThemedText className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Last PUT received:
            </ThemedText>
            {lastPut ? (
              <>
                <ThemedText className="text-xs font-mono text-gray-800 dark:text-gray-200">
                  {JSON.stringify(lastPut, null, 2)}
                </ThemedText>
                {lastPutTimestamp && (
                  <ThemedText className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {formatTimestamp(lastPutTimestamp)}
                  </ThemedText>
                )}
              </>
            ) : (
              <ThemedText className="text-sm text-gray-500 dark:text-gray-500 italic">
                No PUT received yet
              </ThemedText>
            )}
          </View>
        </View>

        {/* PATCH /modify Card */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border-2 border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-3">
            <View className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg px-3 py-1 mr-3">
              <ThemedText className="text-yellow-700 dark:text-yellow-300 font-bold text-xs">
                PATCH
              </ThemedText>
            </View>
            <ThemedText className="text-lg font-bold flex-1">/modify</ThemedText>
          </View>

          <View className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <ThemedText className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Last PATCH received:
            </ThemedText>
            {lastPatch ? (
              <>
                <ThemedText className="text-xs font-mono text-gray-800 dark:text-gray-200">
                  {JSON.stringify(lastPatch, null, 2)}
                </ThemedText>
                {lastPatchTimestamp && (
                  <ThemedText className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {formatTimestamp(lastPatchTimestamp)}
                  </ThemedText>
                )}
              </>
            ) : (
              <ThemedText className="text-sm text-gray-500 dark:text-gray-500 italic">
                No PATCH received yet
              </ThemedText>
            )}
          </View>
        </View>

        {/* DELETE /delete Card */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border-2 border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-3">
            <View className="bg-red-100 dark:bg-red-900/30 rounded-lg px-3 py-1 mr-3">
              <ThemedText className="text-red-700 dark:text-red-300 font-bold text-xs">
                DELETE
              </ThemedText>
            </View>
            <ThemedText className="text-lg font-bold flex-1">/delete</ThemedText>
          </View>

          <View className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <ThemedText className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Test Element Status:
            </ThemedText>
            {!isDeleted ? (
              <View className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                  <ThemedText className="text-green-700 dark:text-green-300 font-semibold ml-2">
                    Element is visible
                  </ThemedText>
                </View>
                <ThemedText className="text-sm text-green-600 dark:text-green-400">
                  Send a DELETE request to remove this element
                </ThemedText>
              </View>
            ) : (
              <View className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="close-circle" size={24} color="#EF4444" />
                  <ThemedText className="text-red-700 dark:text-red-300 font-semibold ml-2">
                    Element has been deleted
                  </ThemedText>
                </View>
                <ThemedText className="text-sm text-red-600 dark:text-red-400 mb-2">
                  Pull to refresh to restore it
                </ThemedText>
                {lastDeleteTimestamp && (
                  <ThemedText className="text-xs text-red-500 dark:text-red-500">
                    Deleted at: {formatTimestamp(lastDeleteTimestamp)}
                  </ThemedText>
                )}
              </View>
            )}
          </View>
        </View>

      </ScrollView>
    </ThemedView>
  );
}
