# permissions.ts — R&D README

> Utility functions for handling camera and photo library permissions on iOS/Android.

**Type:** Utility Module  
**Status:** Production-ready  
**Last updated:** 2026-05-06

---

## What is this?

A cross-platform permission utility that handles Camera and Photo Library permissions for iOS and Android. Provides check, request, and batch request functions with consistent return types.

## Features

### Core Features

- **Camera permission**: `checkCameraPermission()`, `requestCameraPermission()`
- **Media permission**: `checkMediaPermission()`, `requestMediaPermission()` (handles iOS Photo Library and Android READ_MEDIA_IMAGES)
- **Batch requests**: `requestAllPermissions()` requests both permissions in parallel
- **Platform normalization**: Uses `Platform.select()` to map iOS/Android permission constants

## Getting Started

```typescript
import {
  checkCameraPermission,
  requestCameraPermission,
  requestMediaPermission,
  requestAllPermissions,
} from './components/utils/permissions';

// Check current status (returns string: 'GRANTED' | 'DENIED' | 'BLOCKED' | etc)
const status = await checkCameraPermission();

// Request permission (returns boolean)
const granted = await requestCameraPermission();

// Request both camera and media
const { camera, media } = await requestAllPermissions();
```

## Permission Constants

| Platform | Permission | Description |
|----------|------------|-------------|
| iOS | `CAMERA` | NSCameraUsageDescription |
| iOS | `PHOTO_LIBRARY` | NSPhotoLibraryUsageDescription |
| Android | `CAMERA` | android.permission.CAMERA |
| Android | `READ_MEDIA_IMAGES` | android.permission.READ_MEDIA_IMAGES |

---

# MediaPicker.tsx — R&D README

> Ready-to-use media selection component with camera and photo library support.

**Type:** UI Component  
**Status:** Production-ready  
**Last updated:** 2026-05-06

---

## What is this?

A pre-built React Native component that opens a native camera or photo library picker. Handles permission requests automatically and returns selected media assets via callback.

## Features

### Core Features

- **Dual source**: Opens ActionSheet with Camera and Photo Library options
- **Auto-permissions**: Requests camera/photo library permissions before opening
- **Permission denied handling**: Shows Alert with "Open Settings" option when blocked
- **Configurable options**: Quality, resolution, camera type, selection limit

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `MediaPickerOptions` | see below | Image picker config |
| `onMediaSelected` | `(assets) => void` | - | Callback with selected media |
| `buttonText` | `string` | `'Select Media'` | Button label |
| `style` | `object` | - | Container styles |

### MediaPickerOptions

```typescript
interface MediaPickerOptions {
  mediaType?: 'photo' | 'video' | 'all';
  quality?: number;           // 0-1, default 0.8
  maxWidth?: number;         // default 1920
  maxHeight?: number;        // default 1080
  cameraType?: 'back' | 'front';
  includeBase64?: boolean;   // default false
  selectionLimit?: number;   // default 1
}
```

## Getting Started

```typescript
import MediaPicker from './components/MediaPicker';

function App() {
  const handleMedia = (assets) => {
    console.log(assets?.[0]?.uri);
  };

  return (
    <MediaPicker
      onMediaSelected={handleMedia}
      buttonText="Add Photo"
    />
  );
}
```

### With options

```typescript
<MediaPicker
  options={{
    mediaType: 'photo',
    quality: 0.5,
    maxWidth: 1024,
    maxHeight: 1024,
    cameraType: 'front',
    selectionLimit: 3,
  }}
  onMediaSelected={handleMedia}
/>
```

## Return Value

`onMediaSelected` receives an array of assets:

```typescript
assets?: Array<{
  uri: string;
  type?: string;
  fileName?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  base64?: string;
}>
```

## Adoption Checklist

- [ ] Install dependencies: `react-native-permissions`, `react-native-image-picker`
- [ ] Configure permissions in Podfile (iOS) and AndroidManifest.xml
- [ ] Add usage descriptions to Info.plist
- [ ] Import and use `<MediaPicker>` component
- [ ] Handle selected assets in `onMediaSelected` callback
