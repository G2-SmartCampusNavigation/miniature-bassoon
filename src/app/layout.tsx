import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Smart Campus Navigator',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="destination"
        options={{
          title: 'Destination',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}