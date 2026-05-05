import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Linking,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  MediaType,
} from 'react-native-image-picker';

export interface MediaPickerOptions {
  mediaType?: MediaType;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  cameraType?: 'back' | 'front';
  includeBase64?: boolean;
  selectionLimit?: number;
}

export interface MediaPickerButtonProps {
  onMediaSelected?: (assets: ImagePickerResponse) => void;
  options?: MediaPickerOptions;
  buttonText?: string;
  style?: object;
  showPreview?: boolean;
}

const MediaPickerButton: React.FC<MediaPickerButtonProps> = ({
  onMediaSelected,
  options = {},
  buttonText = 'Select Media',
  style,
  showPreview = true,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const defaultOptions = useMemo(
    () => ({
      mediaType: options.mediaType || ('photo' as const),
      quality: (options.quality as any) ?? 0.8,
      maxWidth: options.maxWidth ?? 1920,
      maxHeight: options.maxHeight ?? 1080,
      cameraType: options.cameraType || ('back' as const),
      includeBase64: options.includeBase64 ?? false,
      selectionLimit: options.selectionLimit ?? 1,
    }),
    [options],
  );

  const handleResponse = useCallback(
    (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Something went wrong');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setSelectedImage(asset.uri || null);
        onMediaSelected?.(response);
      }
    },
    [onMediaSelected],
  );

  const openSettings = useCallback(() => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    }
  }, []);

  const handlePermissionDenied = useCallback(
    (permission: string) => {
      Alert.alert(
        'Permission Required',
        `Please enable ${permission} access in your device settings to use this feature.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openSettings },
        ],
      );
    },
    [openSettings],
  );

  const handleCameraPress = useCallback(async () => {
    try {
      const result = await launchCamera({
        ...defaultOptions,
        ...options,
      });
      handleResponse(result);
    } catch (error: any) {
      if (error?.code === 'camera_unavailable') {
        Alert.alert('Error', 'Camera is not available on this device');
      } else if (error?.code === 'permission') {
        handlePermissionDenied('Camera');
      } else {
        Alert.alert('Error', 'Failed to open camera');
      }
    }
  }, [defaultOptions, options, handleResponse, handlePermissionDenied]);

  const handleLibraryPress = useCallback(async () => {
    try {
      const result = await launchImageLibrary({
        ...defaultOptions,
        ...options,
      });
      handleResponse(result);
    } catch (error: any) {
      if (error?.code === 'permission') {
        handlePermissionDenied('Photo Library');
      } else {
        Alert.alert('Error', 'Failed to open photo library');
      }
    }
  }, [defaultOptions, options, handleResponse, handlePermissionDenied]);

  const handlePress = useCallback(() => {
    Alert.alert('Select Media', 'Choose an option', [
      { text: 'Camera', onPress: handleCameraPress },
      { text: 'Photo Library', onPress: handleLibraryPress },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [handleCameraPress, handleLibraryPress]);

  return (
    <View style={[styles.container, style]}>
      <Pressable style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </Pressable>
      {showPreview && selectedImage && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.preview} />
          <Pressable
            style={styles.clearButton}
            onPress={() => setSelectedImage(null)}
          >
            <Text style={styles.clearButtonText}>×</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    marginTop: 16,
    position: 'relative',
  },
  preview: {
    width: 150,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  clearButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});

export default MediaPickerButton;
