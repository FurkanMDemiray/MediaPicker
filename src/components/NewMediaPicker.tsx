import React, { useCallback, useMemo } from 'react';
import { View, Alert, StyleSheet, Pressable, Text } from 'react-native';
import {
  requestAllPermissions,
  requestCameraPermission,
} from './utils/permissions';
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

interface NewMediaPickerProps {
  options?: MediaPickerOptions;
  onMediaSelected?: (assets: ImagePickerResponse['assets']) => void;
  buttonText?: string;
  style?: object;
}

const NewMediaPicker: React.FC<NewMediaPickerProps> = ({
  options = {},
  onMediaSelected,
  buttonText = 'Select Media',
  style,
}) => {
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
    (result: ImagePickerResponse) => {
      if (result.didCancel) {
        return;
      }
      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage ?? 'An error occurred.');
        return;
      }
      if (result.assets && result.assets.length > 0) {
        onMediaSelected?.(result.assets);
      }
    },
    [onMediaSelected],
  );

  const openCamera = useCallback(async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Camera access is required to take photos.',
      );
      return;
    }

    launchCamera(defaultOptions, result => {
      handleResponse(result);
    });
  }, [defaultOptions, handleResponse]);

  const openLibrary = useCallback(async () => {
    const { media } = await requestAllPermissions();
    if (!media) {
      Alert.alert(
        'Permission Required',
        'Photo library access is required to select photos.',
      );
      return;
    }

    launchImageLibrary(defaultOptions, result => {
      handleResponse(result);
    });
  }, [defaultOptions, handleResponse]);

  const handlePress = useCallback(async () => {
    const { camera, media } = await requestAllPermissions();

    if (camera && media) {
      Alert.alert('Select Media', 'Choose an option', [
        { text: 'Camera', onPress: openCamera },
        { text: 'Photo Library', onPress: openLibrary },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } else if (camera) {
      openCamera();
    } else if (media) {
      openLibrary();
    } else {
      Alert.alert(
        'Permission Required',
        'Camera or photo library access is required.',
      );
    }
  }, [openCamera, openLibrary]);

  return (
    <View style={[styles.container, style]}>
      <Pressable style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </Pressable>
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
});

export default NewMediaPicker;
