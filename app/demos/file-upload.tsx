import React, { useState } from 'react';
import { View, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uri: string;
  uploadTime: Date;
}

export default function FileUploadDemo() {
  const [uploads, setUploads] = useState<{ [key: string]: { progress: number; uploading: boolean; error?: string } }>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  const selectAndUploadFile = async () => {
    try {
      // Pick a document
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      const fileId = Date.now().toString();

      // Update selected file name
      setSelectedFileName(file.name);

      setUploads(prev => ({
        ...prev,
        [fileId]: { progress: 0, uploading: true }
      }));

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploads(prev => {
          const currentProgress = prev[fileId]?.progress || 0;
          const newProgress = Math.min(currentProgress + 0.1, 0.9);
          return {
            ...prev,
            [fileId]: { progress: newProgress, uploading: true }
          };
        });
      }, 200);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);

      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(file.uri);

      const uploadedFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size || 0,
        type: file.mimeType || 'unknown',
        uri: file.uri,
        uploadTime: new Date(),
      };

      setUploadedFiles(prev => [uploadedFile, ...prev]);
      setUploads(prev => ({
        ...prev,
        [fileId]: { progress: 1, uploading: false }
      }));

      // Clean up completed upload after 3 seconds
      setTimeout(() => {
        setUploads(prev => {
          const newUploads = { ...prev };
          delete newUploads[fileId];
          return newUploads;
        });
        setSelectedFileName(''); // Clear selected file name
      }, 3000);

      Alert.alert('Upload Complete', `${file.name} has been uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      setSelectedFileName(''); // Clear selected file name on error
      Alert.alert('Upload Failed', 'There was an error uploading the file. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return 'document-text';
    if (type.includes('image')) return 'image';
    if (type.includes('text')) return 'document';
    if (type.includes('json')) return 'code-slash';
    return 'document';
  };

  const renderUploadedFile = (file: UploadedFile) => {
    return (
      <View key={file.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 border-2 border-gray-100 dark:border-gray-700">
        <View className="flex-row items-center">
          <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mr-4">
            <Ionicons name={getFileIcon(file.type) as any} size={24} color="#3B82F6" />
          </View>
          <View className="flex-1">
            <ThemedText className="text-lg font-bold mb-1">{file.name}</ThemedText>
            <ThemedText className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {formatFileSize(file.size)} • {file.type}
            </ThemedText>
            <ThemedText className="text-xs text-gray-500 dark:text-gray-500">
              Uploaded: {file.uploadTime.toLocaleString()}
            </ThemedText>
          </View>
          <View className="bg-green-100 dark:bg-green-900/30 rounded-full p-2">
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          </View>
        </View>
      </View>
    );
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView className="flex-1 p-6">
        <View className="items-center mb-8">
          <ThemedText className="text-3xl font-bold mb-4 text-center">
            File Upload
          </ThemedText>
          <ThemedText className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
            Select and upload files to test upload functionality
          </ThemedText>
        </View>

        {/* File Input - Traditional Style */}
        <View className="mb-8">
          <ThemedText className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Choose File
          </ThemedText>
          <View className="flex-row items-center">
            <View className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 mr-3">
              <ThemedText className="text-gray-500 dark:text-gray-400">
                {selectedFileName || 'No file selected'}
              </ThemedText>
            </View>
            <Pressable
              onPress={selectAndUploadFile}
              className="bg-blue-500 px-6 py-3 rounded-lg active:bg-blue-600"
            >
              <ThemedText className="text-white font-medium">
                Browse...
              </ThemedText>
            </Pressable>
          </View>
          <ThemedText className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Select any file from your device to upload
          </ThemedText>
        </View>

        {/* Upload Progress */}
        {Object.keys(uploads).some(fileId => uploads[fileId].progress < 1) && (
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
            <ThemedText className="text-lg font-bold mb-4">Upload Progress</ThemedText>
            {Object.entries(uploads)
              .filter(([fileId, upload]) => upload.progress < 1)
              .map(([fileId, upload]) => (
                <View key={fileId} className="mb-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <ThemedText className="text-sm font-medium">
                      {upload.uploading ? 'Uploading...' : 'Complete'}
                    </ThemedText>
                    <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round(upload.progress * 100)}%
                    </ThemedText>
                  </View>
                  <View className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <View
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${upload.progress * 100}%` }}
                    />
                  </View>
                  {upload.error && (
                    <ThemedText className="text-red-500 text-sm mt-2">
                      {upload.error}
                    </ThemedText>
                  )}
                </View>
              ))}
          </View>
        )}

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <View>
            <ThemedText className="text-xl font-bold mb-4">Uploaded Files</ThemedText>
            {uploadedFiles.map(renderUploadedFile)}
          </View>
        )}

        {uploadedFiles.length === 0 && Object.keys(uploads).length === 0 && (
          <View className="items-center py-12">
            <Ionicons name="file-tray-outline" size={64} color="#9CA3AF" />
            <ThemedText className="text-gray-500 dark:text-gray-400 text-center mt-4">
              No files uploaded yet.{'\n'}Tap the button above to select a file.
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}