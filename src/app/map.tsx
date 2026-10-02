import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Campus Map
      </Text>

      <Text style={styles.text}>
        The campus map is available on the mobile
        version of the application.
      </Text>

      <Text style={styles.text}>
        Please open Smart Campus Navigator using
        Expo Go on your phone.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#17202A',
    marginBottom: 15,
  },

  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 10,
  },
});
