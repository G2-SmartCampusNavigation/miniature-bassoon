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
      `google.navigation:q=${latitude},${longitude}&mode=w`;

    try {
      if (Platform.OS === 'web') {
        // Open Google Maps walking directions in the browser.
        window.open(googleMapsWebUrl, '_blank', 'noopener,noreferrer');
        return;
      }

      const canOpenApp = await Linking.canOpenURL(
        googleMapsAppUrl
      );

      if (canOpenApp) {
        await Linking.openURL(googleMapsAppUrl);
      } else {
        await Linking.openURL(googleMapsWebUrl);
      }
    } catch (error) {
      console.log('Navigation error:', error);

      Alert.alert(
        'Navigation Error',
        'Unable to open Google Maps. Please try again.'
      );
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