import { Platform } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';

const CAMERA = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
}) as Permission;

const getAndroidVersion = (): number => {
  return parseInt(Platform.Version.toString(), 10);
};

const PHOTO_LIBRARY = Platform.select({
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android:
    getAndroidVersion() >= 33
      ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
}) as Permission;

export const checkCameraPermission = async (): Promise<string> => {
  const result = await check(CAMERA);
  return result;
};

export const checkMediaPermission = async (): Promise<string> => {
  const result = await check(PHOTO_LIBRARY);
  return result;
};

export const requestCameraPermission = async (): Promise<boolean> => {
  const currentStatus = await check(CAMERA);

  if (currentStatus === RESULTS.GRANTED) {
    return true;
  }

  if (currentStatus === RESULTS.DENIED) {
    const result = await request(CAMERA);
    return result === RESULTS.GRANTED;
  }

  return false;
};

export const requestMediaPermission = async (): Promise<boolean> => {
  const currentStatus = await check(PHOTO_LIBRARY);

  if (currentStatus === RESULTS.GRANTED || currentStatus === RESULTS.LIMITED) {
    return true;
  }

  if (currentStatus === RESULTS.DENIED) {
    const result = await request(PHOTO_LIBRARY);
    return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
  }

  return false;
};

export const requestAllPermissions = async (): Promise<{
  camera: boolean;
  media: boolean;
}> => {
  const [camera, media] = await Promise.all([
    requestCameraPermission(),
    requestMediaPermission(),
  ]);

  return { camera, media };
};

export const openSettings = () => {
  // This would require importing from react-native-permissions
  // For now we handle settings in the Alert
};
