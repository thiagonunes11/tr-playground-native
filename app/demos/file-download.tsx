import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Alert, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

interface DownloadableFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
  icon: string;
}

interface DownloadedFile {
  id: string;
  name: string;
  localUri: string;
  downloadTime: Date;
  size: number;
}

const SAMPLE_FILES: DownloadableFile[] = [
  {
    id: '1',
    name: 'Sample PDF Document',
    url: './assets/documents/sample-document.pdf',
    type: 'PDF',
    size: '31.6 KB',
    icon: 'document-text'
  },
  {
    id: '2',
    name: 'Sample Text File',
    url: './assets/documents/sample-text.txt',
    type: 'Text',
    size: '256 B',
    icon: 'document'
  },
  {
    id: '3',
    name: 'Sample JSON Data',
    url: './assets/documents/sample-data.json',
    type: 'JSON',
    size: '245 B',
    icon: 'code-slash'
  }
];

export default function FileDownloadDemo() {
  const [downloads, setDownloads] = useState<{ [key: string]: { progress: number; downloading: boolean; error?: string } }>({});
  const [downloadedFiles, setDownloadedFiles] = useState<DownloadedFile[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [downloadsDirectory, setDownloadsDirectory] = useState<string | null>(null);

  useEffect(() => {
    initializeDownloadsDirectory();
  }, []);

  const initializeDownloadsDirectory = async () => {
    if (Platform.OS !== 'android') {
      // For iOS and other platforms, use app's document directory
      const downloadsDir = `${FileSystem.documentDirectory}downloads/`;
      setDownloadsDirectory(downloadsDir);
      return;
    }

    try {
      // Request permission to access a directory (user will select Downloads)
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permissions.granted) {
        // Use the directory URI that the user selected
        setDownloadsDirectory(permissions.directoryUri);
        console.log('Downloads directory set to:', permissions.directoryUri);
      } else {
        // Fallback to app's document directory
        const downloadsDir = `${FileSystem.documentDirectory}downloads/`;
        setDownloadsDirectory(downloadsDir);
        Alert.alert(
          'Permission Required',
          'Downloads will be saved to app storage. To save to device Downloads folder, please grant storage permissions.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error initializing downloads directory:', error);
      // Fallback to app's document directory
      const downloadsDir = `${FileSystem.documentDirectory}downloads/`;
      setDownloadsDirectory(downloadsDir);
    }
  };

  const loadDownloadedFiles = async () => {
    try {
      const downloadsDir = `${FileSystem.documentDirectory}downloads/`;
      const dirInfo = await FileSystem.getInfoAsync(downloadsDir);

      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadsDir, { intermediates: true });
        return;
      }

      // In a real app, you'd scan the directory for files
      // For demo purposes, we'll maintain state
    } catch (error) {
      console.error('Error loading downloaded files:', error);
    }
  };

  const downloadFile = async (file: DownloadableFile) => {
    if (!downloadsDirectory) {
      Alert.alert('Error', 'Downloads directory not initialized. Please try again.');
      return;
    }

    try {
      setDownloads(prev => ({
        ...prev,
        [file.id]: { progress: 0, downloading: true }
      }));

      // Simulate download progress for local files
      const progressInterval = setInterval(() => {
        setDownloads(prev => {
          const currentProgress = prev[file.id]?.progress || 0;
          const newProgress = Math.min(currentProgress + 0.1, 0.9);
          return {
            ...prev,
            [file.id]: { progress: newProgress, downloading: true }
          };
        });
      }, 200);

      // Read actual file content from assets using Asset module
      let content: string;
      let encoding: 'utf8' | 'base64' = 'utf8';

      try {
        // Create asset from the file path
        const asset = Asset.fromModule(require('../../assets/documents/sample-document.pdf'));
        await asset.downloadAsync();

        if (file.type === 'PDF') {
          // Read PDF as base64 since it's binary
          content = await FileSystem.readAsStringAsync(asset.localUri || asset.uri, { encoding: 'base64' });
          encoding = 'base64';
        } else {
          // For text files, we'd need to handle them differently
          // For now, fallback to generated content for non-PDF files
          throw new Error('Text file reading not implemented');
        }
        console.log(`Read ${file.type} file content, length: ${content.length}`);
      } catch (readError) {
        console.error('Error reading file:', readError);
        // Fallback to generated content if file reading fails
        if (file.type === 'PDF') {
          content = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\nxref\n0 2\n0000000000 65535 f \n0000000009 00000 n \ntrailer\n<<\n/Size 2\n/Root 1 0 R\n>>\nstartxref\n49\n%%EOF';
        } else if (file.type === 'JSON') {
          content = JSON.stringify({
            title: file.name,
            type: file.type,
            downloadedAt: new Date().toISOString(),
            size: file.size
          }, null, 2);
        } else {
          content = `Sample ${file.type} content for ${file.name}\n\nThis is a test file downloaded on ${new Date().toLocaleString()}\n\nFile type: ${file.type}\nFile size: ${file.size}`;
        }
      }

      let fileUri: string;
      let mimeType: string;

      // Determine MIME type based on file type
      switch (file.type) {
        case 'PDF':
          mimeType = 'application/pdf';
          break;
        case 'JSON':
          mimeType = 'application/json';
          break;
        case 'Text':
        default:
          mimeType = 'text/plain';
          break;
      }

      if (Platform.OS === 'android' && downloadsDirectory && downloadsDirectory.includes('content://')) {
        // Use Storage Access Framework for Android Downloads folder
        const fileName = `${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        console.log('Creating file with MIME type:', mimeType);
        fileUri = await FileSystem.StorageAccessFramework.createFileAsync(downloadsDirectory, fileName, mimeType);

        if (encoding === 'base64') {
          // For binary files like PDFs, write as base64
          await FileSystem.StorageAccessFramework.writeAsStringAsync(fileUri, content, { encoding: 'base64' });
        } else {
          // For text files, write as UTF-8
          await FileSystem.StorageAccessFramework.writeAsStringAsync(fileUri, content);
        }
        console.log('File created successfully:', fileUri);
      } else {
        // Use regular file system for app storage or iOS
        const fileName = `${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        fileUri = `${downloadsDirectory}${fileName}`;

        // Ensure directory exists for regular file system
        if (!downloadsDirectory.includes('content://')) {
          const dirInfo = await FileSystem.getInfoAsync(downloadsDirectory);
          if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(downloadsDirectory, { intermediates: true });
          }
        }

        if (encoding === 'base64') {
          await FileSystem.writeAsStringAsync(fileUri, content, { encoding: 'base64' });
        } else {
          await FileSystem.writeAsStringAsync(fileUri, content);
        }
      }

      clearInterval(progressInterval);

      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      const newDownloadedFile: DownloadedFile = {
        id: file.id,
        name: file.name,
        localUri: fileUri,
        downloadTime: new Date(),
        size: (fileInfo as any).size || 0
      };

      setDownloadedFiles(prev => [newDownloadedFile, ...prev]);
      setDownloads(prev => ({
        ...prev,
        [file.id]: { progress: 1, downloading: false }
      }));

      Alert.alert('Download Complete', `${file.name} has been downloaded to your device's Downloads folder!`);
    } catch (error) {
      console.error('Download error:', error);
      console.error('Downloads directory:', downloadsDirectory);
      console.error('Platform:', Platform.OS);

      let errorMessage = 'There was an error downloading the file. Please try again.';
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        errorMessage = `Download failed: ${error.message}`;
      }

      setDownloads(prev => ({
        ...prev,
        [file.id]: { progress: 0, downloading: false, error: errorMessage }
      }));

      Alert.alert('Download Failed', errorMessage);
    }
  };

  const openFile = async (downloadedFile: DownloadedFile) => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL(downloadedFile.localUri);
      } else {
        // For Android, you might need to use a different approach
        // For demo purposes, we'll show an alert
        Alert.alert('File Location', `File saved at: ${downloadedFile.localUri}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open the file');
    }
  };

  const deleteFile = async (downloadedFile: DownloadedFile) => {
    try {
      await FileSystem.deleteAsync(downloadedFile.localUri);
      setDownloadedFiles(prev => prev.filter(f => f.id !== downloadedFile.id));
      Alert.alert('Deleted', 'File has been removed from downloads');
    } catch (error) {
      Alert.alert('Error', 'Unable to delete the file');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const renderFileCard = (file: DownloadableFile) => {
    const downloadState = downloads[file.id];
    const isDownloading = downloadState?.downloading;
    const progress = downloadState?.progress || 0;
    const hasError = downloadState?.error;

    return (
      <View key={file.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border-2 border-gray-100 dark:border-gray-700">
        <View className="flex-row items-start mb-4">
          <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mr-4">
            <Ionicons name={file.icon as any} size={24} color="#3B82F6" />
          </View>
          <View className="flex-1">
            <ThemedText className="text-lg font-bold mb-1">{file.name}</ThemedText>
            <View className="flex-row items-center mb-2">
              <View className="bg-gray-100 dark:bg-gray-700 rounded-lg px-2 py-1 mr-2">
                <ThemedText className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {file.type}
                </ThemedText>
              </View>
              <ThemedText className="text-sm text-gray-500 dark:text-gray-500">
                {file.size}
              </ThemedText>
            </View>
          </View>
        </View>

        {isDownloading && (
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
                Downloading...
              </ThemedText>
              <ThemedText className="text-sm font-medium">
                {Math.round(progress * 100)}%
              </ThemedText>
            </View>
            <View className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <View
                className="bg-blue-500 rounded-full h-2"
                style={{ width: `${progress * 100}%` }}
              />
            </View>
          </View>
        )}

        {hasError && (
          <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
            <ThemedText className="text-red-600 dark:text-red-400 text-sm">
              {hasError}
            </ThemedText>
          </View>
        )}

        <Pressable
          onPress={() => downloadFile(file)}
          disabled={isDownloading}
          className={`rounded-xl py-3 px-4 active:opacity-80 ${
            isDownloading ? 'bg-gray-300 dark:bg-gray-600' : 'bg-blue-500 active:bg-blue-600'
          }`}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons
              name={isDownloading ? "download-outline" : "download"}
              size={18}
              color={isDownloading ? "#9CA3AF" : "white"}
            />
            <ThemedText className={`font-semibold ml-2 ${isDownloading ? 'text-gray-500' : 'text-white'}`}>
              {isDownloading ? 'Downloading...' : 'Download'}
            </ThemedText>
          </View>
        </Pressable>
      </View>
    );
  };

  const renderDownloadedFile = (file: DownloadedFile) => (
    <View key={file.id} className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-3 border-2 border-green-200 dark:border-green-800">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center flex-1 mr-4">
          <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
          <View className="ml-3 flex-1">
            <ThemedText className="font-semibold text-green-800 dark:text-green-200">
              {file.name}
            </ThemedText>
            <ThemedText className="text-xs text-green-600 dark:text-green-400">
              Downloaded {file.downloadTime.toLocaleString()}
            </ThemedText>
          </View>
        </View>
        <ThemedText className="text-sm text-green-600 dark:text-green-400">
          {formatFileSize(file.size)}
        </ThemedText>
      </View>

      <View className="flex-row">
        <Pressable
          onPress={() => openFile(file)}
          className="bg-green-500 rounded-lg py-2 px-4 mr-2 active:bg-green-600 flex-1"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="eye-outline" size={16} color="white" />
            <ThemedText className="text-white font-medium ml-1">View</ThemedText>
          </View>
        </Pressable>

        <Pressable
          onPress={() => deleteFile(file)}
          className="bg-red-500 rounded-lg py-2 px-4 active:bg-red-600"
        >
          <Ionicons name="trash-outline" size={16} color="white" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <ThemedView className="flex-1">
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <View className="bg-green-100 dark:bg-green-900/30 rounded-xl p-3 mr-4">
              <Ionicons name="download-outline" size={32} color="#22C55E" />
            </View>
            <View className="flex-1">
              <ThemedText className="text-2xl font-bold mb-1">
                File Download
              </ThemedText>
            </View>
          </View>
          <ThemedText className="text-base text-gray-600 dark:text-gray-400 leading-6">
            Download various file types and validate download functionality
          </ThemedText>
        </View>

        {/* Available Files */}
        <ThemedText className="text-xl font-bold mb-4">Available Files</ThemedText>
        {SAMPLE_FILES.map(renderFileCard)}

        {/* Downloaded Files */}
        {downloadedFiles.length > 0 && (
          <>
            <ThemedText className="text-xl font-bold mb-4 mt-6">Downloaded Files</ThemedText>
            {downloadedFiles.map(renderDownloadedFile)}
          </>
        )}

        {/* Info Card */}
        <View className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 mb-4 border-2 border-blue-100 dark:border-blue-800">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={24} color="#3B82F6" />
            <View className="flex-1 ml-3">
              <ThemedText className="text-sm text-blue-700 dark:text-blue-300 leading-5">
                Files are saved to the app's local storage. This demo simulates the download experience with progress tracking and file management.
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}