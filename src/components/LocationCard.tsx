import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

type LocationCardProps = {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
};

export default function LocationCard({
  latitude,
  longitude,
  loading,
  error,
}: LocationCardProps) {
  if (loading) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>
          📍 Current Location
        </Text>

        <Text style={styles.loading}>
          Getting your location...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorCard}>
        <Text style={styles.title}>
          📍 Current Location
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>
      </View>
    );
  }

  if (
    latitude === null ||
    longitude === null
  ) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>
          📍 Current Location
        </Text>

        <Text style={styles.loading}>
          Location is not available.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        📍 Current Location
      </Text>

      <Text style={styles.coordinate}>
        Latitude: {latitude.toFixed(6)}
      </Text>

      <Text style={styles.coordinate}>
        Longitude: {longitude.toFixed(6)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EAF4FF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
  },

  errorCard: {
    backgroundColor: '#FFECEC',
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  coordinate: {
    fontSize: 15,
    marginTop: 4,
  },

  loading: {
    color: '#666',
    fontSize: 15,
  },

  errorText: {
    color: '#C62828',
    fontSize: 15,
  },
});