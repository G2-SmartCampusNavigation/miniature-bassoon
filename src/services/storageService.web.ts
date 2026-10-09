
const RECENT_DESTINATIONS_KEY = '@recent_destinations';

export async function saveRecentDestination(destinationId: string) {
  try {
    const existingData = window.localStorage.getItem(
      RECENT_DESTINATIONS_KEY
    );

    const destinations: string[] = existingData
      ? JSON.parse(existingData)
      : [];

    const updatedDestinations = [
      destinationId,
      ...destinations.filter((id) => id !== destinationId),
    ].slice(0, 5);

    window.localStorage.setItem(
      RECENT_DESTINATIONS_KEY,
      JSON.stringify(updatedDestinations)
    );
  } catch (error) {
    console.log('Error saving recent destination:', error);
  }
}

export async function getRecentDestinations(): Promise<string[]> {
  try {
    const data = window.localStorage.getItem(
      RECENT_DESTINATIONS_KEY
    );

    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log('Error getting recent destinations:', error);
    return [];
  }
}
