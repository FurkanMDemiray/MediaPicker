import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import type { ImagePickerResponse } from 'react-native-image-picker';
import NewMediaPicker from './src/components/NewMediaPicker';

function App() {
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);

  const handleMediaSelected = (response: ImagePickerResponse) => {
    if (response.assets && response.assets.length > 0) {
      const uris = response.assets
        .map(asset => asset.uri)
        .filter((uri): uri is string => uri !== undefined);
      setSelectedMedia(prev => [...prev, ...uris]);

      const asset = response.assets[0];
      Alert.alert(
        'Media Selected',
        `File name: ${asset.fileName || 'Unknown'}\nType: ${
          asset.type || 'Unknown'
        }\nSize: ${
          asset.fileSize
            ? `${(asset.fileSize / 1024).toFixed(2)} KB`
            : 'Unknown'
        }`,
      );
    }
  };

  const handleVideoSelect = (): MediaPickerOptions => ({
    mediaType: 'video',
    selectionLimit: 3,
  });

  const handlePhotoSelect = (): MediaPickerOptions => ({
    mediaType: 'photo',
    quality: 0.9,
    maxWidth: 1920,
    maxHeight: 1080,
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Media Picker Demo</Text>
          <Text style={styles.subtitle}>
            Select images or videos from camera or photo library
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photo Selection</Text>
            <NewMediaPicker />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Video Selection</Text>
            <NewMediaPicker />
          </View>

          {selectedMedia.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Selected ({selectedMedia.length})
              </Text>
              <Text style={styles.infoText}>
                Media files are stored in state.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default App;
