import React from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from 'react-native';
import {
  requestAllPermissions,
  requestCameraPermission,
} from './utils/permissions';

interface MediaPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onCameraPress: () => void;
  onLibraryPress: () => void;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  visible,
  onClose,
  onCameraPress,
  onLibraryPress,
}) => {
  const slideAnim = React.useRef(new Animated.Value(300)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 200,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleCameraPress = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 150,
      useNativeDriver: true,
    }).start(() => onClose());
    setTimeout(() => onCameraPress(), 200);
  };

  const handleLibraryPress = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 150,
      useNativeDriver: true,
    }).start(() => onClose());
    setTimeout(() => onLibraryPress(), 200);
  };

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 150,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <Pressable style={styles.backdropPressable} onPress={handleClose} />
        </Animated.View>

        <Animated.View
          style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.handle} />

            <View style={styles.options}>
              <Text style={styles.title}>Select Media</Text>

              <Pressable style={styles.option} onPress={handleCameraPress}>
                <View style={[styles.iconContainer, styles.cameraIcon]}>
                  <Text style={styles.iconText}>C</Text>
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Take Photo</Text>
                  <Text style={styles.optionSubtitle}>
                    Use camera to capture a new photo
                  </Text>
                </View>
              </Pressable>

              <Pressable style={styles.option} onPress={handleLibraryPress}>
                <View style={[styles.iconContainer, styles.libraryIcon]}>
                  <Text style={styles.iconText}>P</Text>
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Choose from Library</Text>
                  <Text style={styles.optionSubtitle}>
                    Select existing photos or videos
                  </Text>
                </View>
              </Pressable>
            </View>

            <Pressable style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropPressable: {
    flex: 1,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 8,
  },
  safeArea: {
    paddingTop: 8,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  options: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cameraIcon: {
    backgroundColor: '#007AFF',
  },
  libraryIcon: {
    backgroundColor: '#34C759',
  },
  iconText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
  },
  cancelButton: {
    marginTop: 12,
    marginHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default MediaPickerModal;
