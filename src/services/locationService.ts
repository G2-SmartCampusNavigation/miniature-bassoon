import * as Location from 'expo-location';
import { Platform } from 'react-native';

export type UserLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
};

export async function getCurrentLocation(): Promise<UserLocation> {
  // WEB: Get location using the browser's geolocation API
  if (Platform.OS === 'web') {
    return new Promise<UserLocation>((resolve, reject) => {
      if (
        typeof navigator === 'undefined' ||
        !navigator.geolocation
      ) {
        reject(
          new Error(
            'Geolocation is not supported by this browser.'
          )
        );
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
          });
        },
        (error) => {
          console.log(
            'Browser location error:',
            error.message
          );

          let message =
            'Unable to get your current location. Please try again.';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              message =
                'Location permission was denied. Please allow location access in your browser settings.';
              break;

            case error.POSITION_UNAVAILABLE:
              message =
                'Your current location is unavailable. Please check your device location settings.';
              break;

            case error.TIMEOUT:
              message =
                'Getting your location timed out. Please try again.';
              break;
          }

          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    });
  }

  // ANDROID / IOS: Request location permission
  const { status } =
    await Location.requestForegroundPermissionsAsync();

  if (status !== Location.PermissionStatus.GRANTED) {
    throw new Error(
      'Location permission was denied. Please allow location access in your device settings.'
    );
  }

  // Get the current device location
  try {
    const location =
      await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      altitude: location.coords.altitude,
    };
  } catch (error) {
    console.log('Device location error:', error);

    throw new Error(
      'Unable to get your current location. Please enable GPS or try again.'
    );
  }
}