import { Platform } from 'react-native';
import {
  check,
  request,
  requestMultiple,
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';

// --- Permission keys per platform ---

const CAMERA = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
}) as Permission;

const PHOTO_LIBRARY = Platform.select({
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
}) as Permission;

const VIDEO_LIBRARY = Platform.select({
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY, // iOS covers both photos & videos
  android: PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
}) as Permission;

// --- Check a single permission ---

export const checkCameraPermission = async () => {
  const result = await check(CAMERA);
  return result;
};

// --- Request camera ---

export const requestCameraPermission = async (): Promise<boolean> => {
  const result = await request(CAMERA);
  return result === RESULTS.GRANTED;
};

// --- Request photo + video (media library) ---

export const requestMediaPermissions = async (): Promise<boolean> => {
  const permissions =
    Platform.OS === 'android'
      ? [
          PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
          PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
        ]
      : [PERMISSIONS.IOS.PHOTO_LIBRARY];

  const results = await requestMultiple(permissions);

  return Object.values(results).every(
    status => status === RESULTS.GRANTED || status === RESULTS.LIMITED,
  );
};

// --- Request all at once ---

export const requestAllPermissions = async (): Promise<{
  camera: boolean;
  media: boolean;
}> => {
  const [camera, media] = await Promise.all([
    requestCameraPermission(),
    requestMediaPermissions(),
  ]);

  return { camera, media };
};
