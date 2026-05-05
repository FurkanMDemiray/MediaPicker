import {useState} from 'react';
import {Alert, Platform} from 'react-native';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
  Permission,
  PermissionStatus,
} from 'react-native-permissions';

export type PermissionType = 'camera' | 'photoLibrary';

const getPermission = (
  type: PermissionType,
): Permission | undefined => {
  if (type === 'camera') {
    return Platform.select({
      ios: PERMISSIONS.IOS.CAMERA,
      android: PERMISSIONS.ANDROID.CAMERA,
    });
  }
  return Platform.select({
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  });
};

const handlePermissionStatus = async (
  type: PermissionType,
  status: PermissionStatus,
  requestFn: () => Promise<void>,
) => {
  const permissionName = type === 'camera' ? 'Camera' : 'Photo Library';

  switch (status) {
    case RESULTS.UNAVAILABLE:
      Alert.alert(
        'Not Available',
        `${permissionName} is not available on this device.`,
      );
      break;
    case RESULTS.DENIED:
      Alert.alert(
        'Permission Denied',
        `${permissionName} access is required. Would you like to allow it?`,
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Allow', onPress: requestFn},
        ],
      );
      break;
    case RESULTS.BLOCKED:
      Alert.alert(
        'Permission Blocked',
        `${permissionName} access is blocked. Please enable it manually in Settings.`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Open Settings',
            onPress: () => openSettings(),
          },
        ],
      );
      break;
    case RESULTS.GRANTED:
      Alert.alert('Permission Granted', `You can now use ${permissionName}.`);
      break;
    default:
      Alert.alert('Unknown permission status');
  }
};

export const usePermission = (type: PermissionType) => {
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus | null>(null);

  const requestPermission = async () => {
    const permission = getPermission(type);
    if (!permission) {
      return;
    }

    const status = await request(permission);
    setPermissionStatus(status);
    await handlePermissionStatus(type, status, requestPermission);
  };

  const checkPermission = async () => {
    const permission = getPermission(type);
    if (!permission) {
      return;
    }

    const status = await check(permission);
    setPermissionStatus(status);
    await handlePermissionStatus(type, status, requestPermission);
    return status;
  };

  return {
    permissionStatus,
    checkPermission,
    requestPermission,
  };
};