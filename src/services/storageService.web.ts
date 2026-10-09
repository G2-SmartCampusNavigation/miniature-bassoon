
const RECENT_DESTINATIONS_KEY = '@recent_destinations';

export async function saveRecentDestination(
  destinationId: string
): Promise<void> {
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
    console.error('Error saving recent destinations:', error);
  }
}

export async function getRecentDestinations(): Promise<string[]> {
  try {
    const data = window.localStorage.getItem(
      RECENT_DESTINATIONS_KEY
    );

    if (!data) return [];

    const parsed: unknown = JSON.parse(data);

    if (
      Array.isArray(parsed) &&
      parsed.every((id) => typeof id === 'string')
    ) {
      return parsed;
    }

    return [];
  } catch (error) {
    console.error('Error getting recent destinations:', error);
    return [];
  }
}
