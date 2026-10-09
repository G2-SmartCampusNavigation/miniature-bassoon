
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

type NavigationButtonProps = {
  latitude: number;
  longitude: number;
};

export default function NavigationButton({
  latitude,
  longitude,
}: NavigationButtonProps) {
  const openNavigation = async () => {
    const googleMapsWebUrl =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${latitude},${longitude}` +
      `&travelmode=walking`;

    const googleMapsAppUrl =
      `google.navigation:q=${latitude},${longitude}`;

    try {
      // On web/laptop, open Google Maps directly in the browser.
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.open(googleMapsWebUrl, '_blank', 'noopener,noreferrer');
        }
        return;
      }

      // On a phone, try the Google Maps app first.
      const canOpenApp = await Linking.canOpenURL(
        googleMapsAppUrl
      );

      if (canOpenApp) {
        await Linking.openURL(googleMapsAppUrl);
      } else {
        await Linking.openURL(googleMapsWebUrl);
      }
    } catch (error) {
      console.error('Navigation error:', error);

      if (Platform.OS === 'web') {
        Alert.alert(
          'Navigation Error',
          'Unable to open Google Maps. Please check your browser.'
        );
      } else {
        Alert.alert(
          'Navigation Error',
          'Unable to open Google Maps.'
        );
      }
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={openNavigation}
      activeOpacity={0.85}
    >
      <Text style={styles.icon}>🧭</Text>
      <Text style={styles.text}>Navigate</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1769AA',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },

  icon: {
    fontSize: 20,
    marginRight: 8,
  },

  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
