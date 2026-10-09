import * as Location from 'expo-location';
import { Platform } from 'react-native';

export type UserLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
};

export async function getCurrentLocation(): Promise<UserLocation> {
  if (Platform.OS === 'web') {
    return new Promise<UserLocation>((resolve, reject) => {
      if (!navigator.geolocation) {
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

          reject(
            new Error(
              'Browser location permission was denied.'
            )
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  const { status } =
    await Location.requestForegroundPermissionsAsync();

  if (
    status !==
    Location.PermissionStatus.GRANTED
  ) {
    throw new Error(
      'Location permission was denied.'
    );
  }

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
}