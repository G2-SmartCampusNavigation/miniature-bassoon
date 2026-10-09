
export async function saveRecentDestination(
  destinationId: string
): Promise<void> {
  console.warn(
    'Platform-specific storage was not selected. Unable to save destination:',
    destinationId
  );
}

export async function getRecentDestinations(): Promise<string[]> {
  console.warn(
    'Platform-specific storage was not selected. Returning an empty list.'
  );

  return [];
}
