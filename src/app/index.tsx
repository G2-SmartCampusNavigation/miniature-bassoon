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
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* DESTINATIONS HEADER */}
        <View style={styles.destinationHeader}>
          <View>
            <Text style={styles.destinationTitle}>
              Campus Destinations
            </Text>

            <Text style={styles.destinationSubtitle}>
              {filteredDestinations.length}{' '}
              {filteredDestinations.length ===
              1
                ? 'place'
                : 'places'}{' '}
              found
            </Text>
          </View>

          <TouchableOpacity
            style={styles.sortButton}
            onPress={() =>
              setNearestFirst(
                !nearestFirst
              )
            }
          >
            <Text style={styles.sortButtonText}>
              {nearestFirst
                ? 'Nearest First'
                : 'Default Order'}
            </Text>

            <Text style={styles.sortArrow}>
              ↕
            </Text>
          </TouchableOpacity>
        </View>

        {/* DESTINATION CARDS */}
        {filteredDestinations.map(
          (destination) => {
            const distance =
              getDistance(
                destination.latitude,
                destination.longitude
              );

            return (
              <DestinationCard
                key={destination.id}
                name={destination.name}
                code={destination.code}
                category={getDisplayCategory(
                  destination.category
                )}
                description={
                  destination.description
                }
                distance={
                  distance !== null
                    ? formatDistance(
                        distance
                      )
                    : 'Distance unavailable'
                }
                icon={getDestinationIcon(
                  destination.category
                )}
                onPress={() =>
                  openDestination(
                    destination.id
                  )
                }
              />
            );
          }
        )}

        {/* NO RESULTS */}
        {filteredDestinations.length ===
          0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsIcon}>
              🔍
            </Text>

            <Text style={styles.noResultsTitle}>
              No destinations found
            </Text>

            <Text style={styles.noResultsText}>
              Try another building name,
              code, or category.
            </Text>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F8FC',
  },

  container: {
    flex: 1,
  },

  contentContainer: {
    padding: 18,
    paddingBottom: 35,
  },

  header: {
    marginBottom: 18,
  },

  groupBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAF4FF',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },

  groupBadgeText: {
    color: '#1769AA',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#17202A',
    lineHeight: 34,
  },

  subtitle: {
    marginTop: 7,
    fontSize: 14,
    lineHeight: 20,
    color: '#697586',
  },

  compass: {
    fontSize: 40,
    marginLeft: 10,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E7EF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 12,
    elevation: 1,
  },

  searchIcon: {
    fontSize: 19,
    marginRight: 9,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#17202A',
  },

  /* QR SCANNER */

  scannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE6F0',
    borderRadius: 15,
    padding: 13,
    marginBottom: 15,
    elevation: 1,
  },

  scannerIconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#EEF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  scannerIcon: {
    fontSize: 23,
  },

  scannerContent: {
    flex: 1,
  },

  scannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#17202A',
  },

  scannerSubtitle: {
    marginTop: 3,
    fontSize: 11,
    color: '#7A8594',
  },

  scannerArrow: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1769AA',
    marginLeft: 8,
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  locationCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationCountIcon: {
    fontSize: 17,
    marginRight: 6,
  },

  locationCountText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },

  nearestText: {
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
    fontSize: 12,
    color: '#718096',
  },

  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    marginBottom: 17,
    borderWidth: 1,
    borderColor: '#DFE7EF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },

  locationHeader: {
    marginBottom: 17,
  },

  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationIconBox: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#EEF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  locationIcon: {
    fontSize: 22,
  },

  locationTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#17202A',
  },

  locationSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: '#7A8594',
  },

  gpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 11,
    backgroundColor: '#EAF8F0',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },

  gpsDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#20A464',
    marginRight: 6,
  },

  gpsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#18834E',
  },

  locationInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: '#EEF1F5',
    paddingTop: 14,
  },

  infoItem: {
    width: '50%',
    marginBottom: 14,
  },

  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8993A2',
    letterSpacing: 0.6,
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#253141',
  },

  activeStatus: {
    color: '#18834E',
  },

  locationButtons: {
    flexDirection: 'row',
    marginTop: 2,
  },

  refreshButton: {
    flex: 1,
    backgroundColor: '#EEF6FF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 7,
  },

  refreshButtonText: {
    color: '#1769AA',
    fontSize: 13,
    fontWeight: '700',
  },

  mapButton: {
    flex: 1,
    backgroundColor: '#1769AA',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 7,
  },

  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  categoryContainer: {
    paddingBottom: 18,
  },

  categoryChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE6EE',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginRight: 8,
  },

  categoryChipSelected: {
    backgroundColor: '#1769AA',
    borderColor: '#1769AA',
  },

  categoryChipText: {
    color: '#667085',
    fontSize: 12,
    fontWeight: '700',
  },

  categoryChipTextSelected: {
    color: '#FFFFFF',
  },

  destinationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },

  destinationTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#17202A',
  },

  destinationSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: '#7A8594',
  },

  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE6EE',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  sortButtonText: {
    color: '#526173',
    fontSize: 11,
    fontWeight: '700',
  },

  sortArrow: {
    marginLeft: 5,
    color: '#1769AA',
    fontSize: 15,
    fontWeight: '700',
  },

  noResults: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3E8EF',
  },

  noResultsIcon: {
    fontSize: 30,
    marginBottom: 8,
  },

  noResultsTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#263342',
  },

  noResultsText: {
    marginTop: 5,
    fontSize: 13,
    color: '#7A8594',
    textAlign: 'center',
  },

  bottomSpace: {
    height: 20,
  },
});