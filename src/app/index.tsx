import { useEffect, useMemo, useState } from 'react';

import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

import DestinationCard from '../components/DestinationCard';
import { destinations } from '../data/destinations';
import {
  getCurrentLocation,
  UserLocation,
} from '../services/locationService';
import {
  calculateDistance,
  formatDistance,
} from '../utils/distance';

export default function HomeScreen() {
  const router = useRouter();

  const [location, setLocation] =
    useState<UserLocation | null>(null);

  const [loadingLocation, setLoadingLocation] =
    useState(false);

  const [searchText, setSearchText] =
    useState('');

  const [selectedCategory, setSelectedCategory] =
    useState('All');

  const [nearestFirst, setNearestFirst] =
    useState(true);

  const categories = [
    'All',
    'Academic',
    'Administrative',
    'Food & Services',
    'Facilities',
    'Sports & Recreation',
  ];

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    try {
      setLoadingLocation(true);

      const currentLocation =
        await getCurrentLocation();

      setLocation(currentLocation);
    } catch (error) {
      console.log('Location error:', error);

      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please allow location permission and try again.'
      );
    } finally {
      setLoadingLocation(false);
    }
  };

  const getDisplayCategory = (
    category: string
  ) => {
    switch (category) {
      case 'Office':
        return 'Administrative';

      case 'Food':
      case 'Student Services':
        return 'Food & Services';

      case 'Health':
        return 'Facilities';

      case 'Sports':
        return 'Sports & Recreation';

      default:
        return category;
    }
  };

  const getDestinationIcon = (
    category: string
  ) => {
    switch (category) {
      case 'Academic':
        return '💻';

      case 'Food':
        return '🍱';

      case 'Office':
        return '🏢';

      case 'Student Services':
        return '🎓';

      case 'Sports':
        return '🏃';

      case 'Health':
        return '🏥';

      default:
        return '📍';
    }
  };

  const getDistance = (
    latitude: number,
    longitude: number
  ) => {
    if (!location) {
      return null;
    }

    return calculateDistance(
      location.latitude,
      location.longitude,
      latitude,
      longitude
    );
  };

  const filteredDestinations = useMemo(() => {
    const search = searchText
      .trim()
      .toLowerCase();

    const filtered = destinations.filter(
      (destination) => {
        const displayCategory =
          getDisplayCategory(
            destination.category
          );

        const matchesSearch =
          destination.name
            .toLowerCase()
            .includes(search) ||
          destination.description
            .toLowerCase()
            .includes(search) ||
          destination.code
            .toLowerCase()
            .includes(search);

        const matchesCategory =
          selectedCategory === 'All' ||
          displayCategory ===
            selectedCategory;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );

    if (nearestFirst && location) {
      filtered.sort((a, b) => {
        const distanceA =
          calculateDistance(
            location.latitude,
            location.longitude,
            a.latitude,
            a.longitude
          );

        const distanceB =
          calculateDistance(
            location.latitude,
            location.longitude,
            b.latitude,
            b.longitude
          );

        return distanceA - distanceB;
      });
    }

    return filtered;
  }, [
    searchText,
    selectedCategory,
    nearestFirst,
    location,
  ]);

  const nearestDestination =
    useMemo(() => {
      if (!location || destinations.length === 0) {
        return null;
      }

      let nearest = destinations[0];

      let nearestDistance =
        calculateDistance(
          location.latitude,
          location.longitude,
          nearest.latitude,
          nearest.longitude
        );

      destinations.forEach((destination) => {
        const distance =
          calculateDistance(
            location.latitude,
            location.longitude,
            destination.latitude,
            destination.longitude
          );

        if (distance < nearestDistance) {
          nearest = destination;
          nearestDistance = distance;
        }
      });

      return {
        destination: nearest,
        distance: nearestDistance,
      };
    }, [location]);

  const openDestination = (
    id: string
  ) => {
    router.push({
      pathname: '/destination',
      params: {
        id,
      },
    });
  };

  const openCampusMap = () => {
    router.push('/map');
  };

  const openScanner = () => {
    router.push('/scanner');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.contentContainer
        }
        refreshControl={
          <RefreshControl
            refreshing={loadingLocation}
            onRefresh={loadLocation}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.groupBadge}>
            <Text style={styles.groupBadgeText}>
              ✦ GROUP 2
            </Text>
          </View>

          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                Smart Campus Navigator
              </Text>

              <Text style={styles.subtitle}>
                Find buildings, services, and
                destinations around campus
              </Text>
            </View>

            <Text style={styles.compass}>
              🧭
            </Text>
          </View>
        </View>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>
            🔍
          </Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search building, lab, library, or food..."
            placeholderTextColor="#8A94A3"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* QR SCANNER BUTTON */}
        <TouchableOpacity
          style={styles.scannerButton}
          onPress={openScanner}
          activeOpacity={0.85}
        >
          <View style={styles.scannerIconBox}>
            <Text style={styles.scannerIcon}>
              📷
            </Text>
          </View>

          <View style={styles.scannerContent}>
            <Text style={styles.scannerTitle}>
              Scan Campus QR Code
            </Text>

            <Text style={styles.scannerSubtitle}>
              Scan a QR code to identify a campus
              location
            </Text>
          </View>

          <Text style={styles.scannerArrow}>
            →
          </Text>
        </TouchableOpacity>

        {/* SUMMARY */}
        <View style={styles.summaryRow}>
          <View style={styles.locationCount}>
            <Text style={styles.locationCountIcon}>
              🏢
            </Text>

            <Text style={styles.locationCountText}>
              {destinations.length} Locations
            </Text>
          </View>

          {nearestDestination && (
            <Text style={styles.nearestText}>
              Nearest:{' '}
              {nearestDestination.destination.name}
            </Text>
          )}
        </View>

        {/* CURRENT LOCATION CARD */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <View style={styles.locationTitleRow}>
              <View style={styles.locationIconBox}>
                <Text style={styles.locationIcon}>
                  📍
                </Text>
              </View>

              <View>
                <Text style={styles.locationTitle}>
                  Current Location
                </Text>

                <Text style={styles.locationSubtitle}>
                  {loadingLocation
                    ? 'Getting your GPS location...'
                    : location
                    ? 'GPS location updated'
                    : 'Location not available'}
                </Text>
              </View>
            </View>

            <View style={styles.gpsBadge}>
              <View
                style={styles.gpsDot}
              />

              <Text style={styles.gpsText}>
                GPS Active (Live)
              </Text>
            </View>
          </View>

          <View style={styles.locationInfoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>
                LATITUDE
              </Text>

              <Text style={styles.infoValue}>
                {location
                  ? `${location.latitude.toFixed(
                      5
                    )}° ${
                      location.latitude >=
                      0
                        ? 'N'
                        : 'S'
                    }`
                  : '--'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>
                LONGITUDE
              </Text>

              <Text style={styles.infoValue}>
                {location
                  ? `${location.longitude.toFixed(
                      5
                    )}° ${
                      location.longitude >=
                      0
                        ? 'E'
                        : 'W'
                    }`
                  : '--'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>
                STATUS
              </Text>

              <Text
                style={[
                  styles.infoValue,
                  styles.activeStatus,
                ]}
              >
                {location
                  ? 'GPS Active'
                  : 'Waiting'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>
                ALTITUDE
              </Text>

              <Text style={styles.infoValue}>
                {location?.altitude != null
                  ? `${Math.round(
                      location.altitude
                    )} m`
                  : 'Ground'}
              </Text>
            </View>
          </View>

          <View style={styles.locationButtons}>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadLocation}
              disabled={loadingLocation}
            >
              <Text style={styles.refreshButtonText}>
                🔄{' '}
                {loadingLocation
                  ? 'Updating...'
                  : 'Refresh GPS'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mapButton}
              onPress={openCampusMap}
            >
              <Text style={styles.mapButtonText}>
                🗺️ Campus Map
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CATEGORY FILTERS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.categoryContainer
          }
        >
          {categories.map((category) => {
            const selected =
              selectedCategory === category;

            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selected &&
                    styles.categoryChipSelected,
                ]}
                onPress={() =>
                  setSelectedCategory(
                    category
                  )
                }
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selected &&
                      styles.categoryChipTextSelected,
                  ]}
                >
                  {