import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_DESTINATIONS_KEY = '@recent_destinations';

export async function saveRecentDestination(
  destinationId: string
) {
  try {
    const existingData =
      await AsyncStorage.getItem(
        RECENT_DESTINATIONS_KEY
      );

    const destinations: string[] = existingData
      ? JSON.parse(existingData)
      : [];

    const updatedDestinations = [
      destinationId,
      ...destinations.filter(
        (id) => id !== destinationId
      ),
    ].slice(0, 5);

    await AsyncStorage.setItem(
      RECENT_DESTINATIONS_KEY,
      JSON.stringify(updatedDestinations)
    );
  } catch (error) {
    console.log(
      'Error saving recent destination:',
      error
    );
  }
}

export async function getRecentDestinations(): Promise<
  string[]
> {
  try {
    const data = await AsyncStorage.getItem(
      RECENT_DESTINATIONS_KEY
    );

    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log(
      'Error getting recent destinations:',
      error
    );

    return [];
  }
}