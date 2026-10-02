import {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

import { getCurrentLocation } from '../services/locationService';

import { destinations } from '../data/destinations';

type UserLocation = {
  latitude: number;
  longitude: number;
};

export default function MapScreen() {
  const router = useRouter();

  const [location, setLocation] =
    useState<UserLocation | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * GET CURRENT LOCATION
   */
  const loadLocation = async () => {
    try {
      setError(null);
      setLoading(true);

      const currentLocation =
        await getCurrentLocation();

      setLocation(currentLocation);
    } catch (error) {
      console.log(
        'Location error:',
        error
      );

      setError(
        'Unable to get your current location.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * LOAD LOCATION WHEN SCREEN OPENS
   */
  useEffect(() => {
    loadLocation();
  }, []);

  /*
   * MY LOCATION BUTTON
   */
  const goToMyLocation = async () => {
    try {
      setError(null);
      setLoading(true);

      const currentLocation =
        await getCurrentLocation();

      setLocation(currentLocation);

      Alert.alert(
        'Your Current Location',
        `Latitude: ${currentLocation.latitude.toFixed(
          6
        )}\nLongitude: ${currentLocation.longitude.toFixed(
          6
        )}`
      );
    } catch (error) {
      console.log(
        'My Location error:',
        error
      );

      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please make sure GPS is turned on and location permission is allowed.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * OPEN DESTINATION
   */
  const openDestination = (
    destinationId: string
  ) => {
    router.push({
      pathname: '/destination',
      params: {
        id: destinationId,
      },
    });
  };

  return (
    <View style={styles.container}>

      {/* ================= HEADER ================= */}

      <View style={styles.header}>

        <Text style={styles.title}>
          Campus Map
        </Text>

        <Text style={styles.subtitle}>
          USTP CDO Campus Map
        </Text>

      </View>


      {/* ================= CAMPUS MAP ================= */}

      <View style={styles.mapContainer}>

        <ScrollView
          style={styles.mapScroll}
          contentContainerStyle={
            styles.mapScrollContent
          }
          maximumZoomScale={3}
          minimumZoomScale={1}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={true}
        >

          <Image
            source={require('../../assets/images/campus-map.jpg')}
            style={styles.campusMap}
            resizeMode="contain"
          />

        </ScrollView>


        {/* ================= MY LOCATION BUTTON ================= */}

        <TouchableOpacity
          style={styles.locationButton}
          onPress={goToMyLocation}
          activeOpacity={0.7}
        >

          <Text
            style={styles.locationButtonText}
          >
            📍 My Location
          </Text>

        </TouchableOpacity>


        {/* ================= LOCATION STATUS ================= */}

        {location && (
          <View style={styles.locationBox}>

            <Text style={styles.locationTitle}>
              📍 Current Location
            </Text>

            <Text style={styles.locationText}>
              Latitude: {location.latitude.toFixed(6)}
            </Text>

            <Text style={styles.locationText}>
              Longitude: {location.longitude.toFixed(6)}
            </Text>

          </View>
        )}

      </View>


      {/* ================= LOADING ================= */}

      {loading && (
        <View style={styles.loadingBox}>

          <ActivityIndicator
            size="small"
          />

          <Text style={styles.loadingText}>
            Getting your location...
          </Text>

        </View>
      )}


      {/* ================= ERROR ================= */}

      {error && (
        <View style={styles.errorBox}>

          <Text style={styles.errorText}>
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadLocation}
            activeOpacity={0.8}
          >

            <Text style={styles.retryText}>
              Try Again
            </Text>

          </TouchableOpacity>

        </View>
      )}


      {/* ================= DESTINATIONS ================= */}

      <View
        style={styles.destinationPanel}
      >

        <Text style={styles.infoTitle}>
          Campus Destinations
        </Text>

        <Text style={styles.infoText}>
          {destinations.length} destinations available
        </Text>


        <ScrollView
          style={styles.destinationScroll}
          showsVerticalScrollIndicator={
            false
          }
        >

          {destinations.map(
            (destination) => (
              <TouchableOpacity
                key={destination.id}
                style={
                  styles.destinationItem
                }
                onPress={() =>
                  openDestination(
                    destination.id
                  )
                }
                activeOpacity={0.7}
              >

                <View
                  style={
                    styles.destinationTextContainer
                  }
                >

                  <Text
                    style={
                      styles.destinationName
                    }
                  >
                    {destination.name}
                  </Text>

                  <Text
                    style={
                      styles.destinationCategory
                    }
                  >
                    {destination.category}
                  </Text>

                </View>

                <Text
                  style={styles.arrow}
                >
                  →
                </Text>

              </TouchableOpacity>
            )
          )}

        </ScrollView>

      </View>

    </View>
  );
}


/* ================================================= */
/* STYLES */
/* ================================================= */

const styles = StyleSheet.create({

  /*
   * MAIN CONTAINER
   */
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },


  /*
   * HEADER
   */
  header: {
    backgroundColor: '#FFFFFF',

    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 15,

    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',

    zIndex: 10,
    elevation: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#17202A',
  },

  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
  },


  /*
   * MAP CONTAINER
   */
  mapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#EAF4EA',
  },


  /*
   * MAP SCROLL
   */
  mapScroll: {
    flex: 1,
  },

  mapScrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },


  /*
   * CAMPUS MAP IMAGE
   */
  campusMap: {
    width: 900,
    height: 650,
  },


  /*
   * MY LOCATION BUTTON
   */
  locationButton: {
    position: 'absolute',

    top: 20,
    right: 20,

    backgroundColor: '#FFFFFF',

    paddingHorizontal: 18,
    paddingVertical: 13,

    borderRadius: 12,

    elevation: 10,

    zIndex: 100,
  },

  locationButtonText: {
    color: '#1769AA',

    fontWeight: 'bold',

    fontSize: 14,
  },


  /*
   * CURRENT LOCATION
   */
  locationBox: {
    position: 'absolute',

    top: 75,
    right: 20,

    backgroundColor: '#FFFFFF',

    padding: 12,

    borderRadius: 10,

    elevation: 8,

    zIndex: 90,
  },

  locationTitle: {
    fontSize: 14,

    fontWeight: 'bold',

    color: '#17202A',

    marginBottom: 5,
  },

  locationText: {
    fontSize: 12,

    color: '#555555',

    marginTop: 2,
  },


  /*
   * LOADING
   */
  loadingBox: {
    position: 'absolute',

    top: 125,
    left: 20,
    right: 20,

    backgroundColor: '#FFFFFF',

    padding: 12,

    borderRadius: 12,

    flexDirection: 'row',

    alignItems: 'center',

    elevation: 20,

    zIndex: 200,
  },

  loadingText: {
    marginLeft: 10,

    color: '#555555',

    fontSize: 14,
  },


  /*
   * ERROR
   */
  errorBox: {
    position: 'absolute',

    top: 125,
    left: 20,
    right: 20,

    backgroundColor: '#FFFFFF',

    padding: 15,

    borderRadius: 12,

    elevation: 20,

    zIndex: 300,
  },

  errorText: {
    color: '#C62828',

    fontSize: 14,

    marginBottom: 10,
  },


  /*
   * RETRY
   */
  retryButton: {
    backgroundColor: '#1769AA',

    paddingVertical: 10,

    borderRadius: 8,

    alignItems: 'center',
  },

  retryText: {
    color: '#FFFFFF',

    fontWeight: 'bold',
  },


  /*
   * DESTINATION PANEL
   */
  destinationPanel: {
    position: 'absolute',

    left: 20,
    right: 20,

    bottom: 20,

    backgroundColor: '#FFFFFF',

    padding: 16,

    borderRadius: 14,

    elevation: 20,

    zIndex: 100,

    maxHeight: 300,
  },

  infoTitle: {
    fontSize: 17,

    fontWeight: 'bold',

    color: '#17202A',
  },

  infoText: {
    fontSize: 13,

    color: '#666666',

    marginTop: 3,
  },


  /*
   * DESTINATION SCROLL
   */
  destinationScroll: {
    marginTop: 8,
  },


  /*
   * DESTINATION ITEM
   */
  destinationItem: {
    backgroundColor: '#F8FAFC',

    paddingHorizontal: 14,
    paddingVertical: 12,

    borderRadius: 10,

    marginTop: 8,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    borderWidth: 1,

    borderColor: '#E5E5E5',
  },

  destinationTextContainer: {
    flex: 1,
  },

  destinationName: {
    fontSize: 15,

    fontWeight: 'bold',

    color: '#17202A',
  },

  destinationCategory: {
    fontSize: 12,

    color: '#666666',

    marginTop: 3,
  },

  arrow: {
    fontSize: 22,

    color: '#1769AA',

    fontWeight: 'bold',

    marginLeft: 10,
  },

});