
import { useEffect, useState } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';

import { destinations } from '../data/destinations';
import type { Destination } from '../data/destinations';

import {
  getCurrentLocation,
  UserLocation,
} from '../services/locationService';

import {
  calculateDistance,
  formatDistance,
} from '../utils/distance';

import NavigationButton from '../components/NavigationButton';

import {
  saveRecentDestination,
  getRecentDestinations,
} from '../services/storageService';

export default function DestinationScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  const [destination, setDestination] =
    useState<Destination | null>(null);

  const [currentLocation, setCurrentLocation] =
    useState<UserLocation | null>(null);

  const [recentDestinations, setRecentDestinations] =
    useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDestination = async () => {
      try {
        setLoading(true);
        setError(null);

        const foundDestination = destinations.find(
          (item) => item.id === id
        );

        if (!foundDestination) {
          if (isMounted) {
            setError('Destination not found.');
          }
          return;
        }

        if (isMounted) {
          setDestination(foundDestination);
        }

        // Save the selected destination.
        await saveRecentDestination(foundDestination.id);

        // Load recently viewed destinations.
        const recent = await getRecentDestinations();

        if (isMounted) {
          setRecentDestinations(recent);
        }

        // Get the user's current GPS location.
        try {
          const location = await getCurrentLocation();

          if (isMounted) {
            setCurrentLocation(location);
          }
        } catch (locationError) {
          console.warn(
            'Unable to get current location:',
            locationError
          );

          // The destination details can still be displayed
          // when GPS is unavailable.
        }
      } catch (loadError) {
        console.error('Error loading destination:', loadError);

        if (isMounted) {
          setError('Unable to load destination information.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDestination();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingIcon}>📍</Text>

        <Text style={styles.loadingTitle}>
          Loading destination...
        </Text>

        <Text style={styles.loadingText}>
          Getting destination information and your current location.
        </Text>
      </View>
    );
  }

  if (error || !destination) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>

        <Text style={styles.errorTitle}>
          Destination Unavailable
        </Text>

        <Text style={styles.errorText}>
          {error || 'Destination not found.'}
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            ← Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const distance =
    currentLocation !== null
      ? calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          destination.latitude,
          destination.longitude
        )
      : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
        >
          <Text style={styles.headerBackText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Destination</Text>
      </View>

      {/* Destination Header */}
      <View style={styles.destinationHeader}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>📍</Text>
        </View>

        <Text style={styles.destinationName}>
          {destination.name}
        </Text>

        <Text style={styles.destinationCode}>
          {destination.code}
        </Text>

        <View style={styles.categoryBadge}>
          <View style={styles.categoryDot} />

          <Text style={styles.categoryText}>
            {destination.category}
          </Text>
        </View>
      </View>

      {/* About */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          About this destination
        </Text>

        <Text style={styles.description}>
          {destination.description}
        </Text>
      </View>

      {/* Location */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          📍 Destination Location
        </Text>

        <View style={styles.coordinateRow}>
          <View style={styles.coordinateBox}>
            <Text style={styles.coordinateLabel}>
              LATITUDE
            </Text>

            <Text style={styles.coordinateValue}>
              {destination.latitude.toFixed(5)} ° N
            </Text>
          </View>

          <View style={styles.coordinateBox}>
            <Text style={styles.coordinateLabel}>
              LONGITUDE
            </Text>

            <Text style={styles.coordinateValue}>
              {destination.longitude.toFixed(5)} ° E
            </Text>
          </View>
        </View>
      </View>

      {/* Distance */}
      <View style={styles.distanceCard}>
        <Text style={styles.distanceIcon}>🚶</Text>

        <View style={styles.distanceContent}>
          <Text style={styles.distanceLabel}>
            DISTANCE FROM YOU
          </Text>

          <Text style={styles.distanceValue}>
            {distance !== null
              ? formatDistance(distance)
              : 'Location unavailable'}
          </Text>
        </View>
      </View>

      {/* Recent destinations status */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Recently Viewed
        </Text>

        <Text style={styles.description}>
          {recentDestinations.length > 0
            ? `${recentDestinations.length} recent destination(s) saved on this device.`
            : 'No recent destinations saved yet.'}
        </Text>
      </View>

      {/* Navigation */}
      <View style={styles.navigationCard}>
        <Text style={styles.navigationTitle}>
          Ready to go?
        </Text>

        <Text style={styles.navigationText}>
          Open Google Maps for directions to this destination.
        </Text>

        <NavigationButton
          latitude={destination.latitude}
          longitude={destination.longitude}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FC',
  },

  content: {
    paddingBottom: 30,
  },

  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5EAF0',
  },

  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  headerBackText: {
    fontSize: 24,
    color: '#1769AA',
    fontWeight: '700',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#17202A',
  },

  destinationHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 28,
    backgroundColor: '#FFFFFF',
  },

  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#EEF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  icon: {
    fontSize: 34,
  },

  destinationName: {
    fontSize: 25,
    fontWeight: '800',
    color: '#17202A',
    textAlign: 'center',
  },

  destinationCode: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 5,
  },

  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8F4',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 10,
  },

  categoryDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#2E8B57',
    marginRight: 6,
  },

  categoryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E8B57',
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4EAF0',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#17202A',
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: '#5B6573',
  },

  coordinateRow: {
    flexDirection: 'row',
    gap: 10,
  },

  coordinateBox: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 12,
    borderRadius: 12,
  },

  coordinateLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7A8491',
    marginBottom: 5,
  },

  coordinateValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#263238',
  },

  distanceCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#EEF6FF',
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  distanceIcon: {
    fontSize: 30,
    marginRight: 14,
  },

  distanceContent: {
    flex: 1,
  },

  distanceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5C7185',
    marginBottom: 3,
  },

  distanceValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1769AA',
  },

  navigationCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4EAF0',
  },

  navigationTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#17202A',
  },

  navigationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#687381',
    marginTop: 6,
    marginBottom: 8,
  },

  centerContainer: {
    flex: 1,
    backgroundColor: '#F5F8FC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  loadingIcon: {
    fontSize: 45,
    marginBottom: 15,
  },

  loadingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#17202A',
  },

  loadingText: {
    fontSize: 14,
    color: '#687381',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },

  errorIcon: {
    fontSize: 45,
    marginBottom: 15,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#17202A',
  },

  errorText: {
    fontSize: 14,
    color: '#C62828',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },

  backButton: {
    marginTop: 20,
    backgroundColor: '#1769AA',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  backButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
