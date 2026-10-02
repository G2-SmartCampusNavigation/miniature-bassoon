import { useEffect, useState } from 'react';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Accelerometer } from 'expo-sensors';

export default function SensorScreen() {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [subscription, setSubscription] =
    useState<ReturnType<
      typeof Accelerometer.addListener
    > | null>(null);

  const [isActive, setIsActive] = useState(false);

  const startSensor = () => {
    Accelerometer.setUpdateInterval(500);

    const newSubscription =
      Accelerometer.addListener((accelerometerData) => {
        setData(accelerometerData);
      });

    setSubscription(newSubscription);
    setIsActive(true);
  };

  const stopSensor = () => {
    subscription?.remove();
    setSubscription(null);
    setIsActive(false);
  };

  useEffect(() => {
    return () => {
      subscription?.remove();
    };
  }, [subscription]);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📱</Text>

      <Text style={styles.title}>
        Device Sensor
      </Text>

      <Text style={styles.subtitle}>
        Accelerometer
      </Text>

      <View style={styles.statusCard}>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: isActive
                ? '#2E8B57'
                : '#9CA3AF',
            },
          ]}
        />

        <Text style={styles.statusText}>
          {isActive
            ? 'Sensor Active'
            : 'Sensor Inactive'}
        </Text>
      </View>

      <View style={styles.sensorCard}>
        <Text style={styles.cardTitle}>
          Live Sensor Values
        </Text>

        <View style={styles.valueRow}>
          <Text style={styles.label}>
            X Axis
          </Text>

          <Text style={styles.value}>
            {data.x.toFixed(3)}
          </Text>
        </View>

        <View style={styles.valueRow}>
          <Text style={styles.label}>
            Y Axis
          </Text>

          <Text style={styles.value}>
            {data.y.toFixed(3)}
          </Text>
        </View>

        <View style={styles.valueRow}>
          <Text style={styles.label}>
            Z Axis
          </Text>

          <Text style={styles.value}>
            {data.z.toFixed(3)}
          </Text>
        </View>
      </View>

      <Text style={styles.instruction}>
        Move or tilt your phone to see the sensor
        values change.
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isActive
              ? '#C62828'
              : '#1769AA',
          },
        ]}
        onPress={
          isActive
            ? stopSensor
            : startSensor
        }
      >
        <Text style={styles.buttonText}>
          {isActive
            ? 'Stop Sensor'
            : 'Start Sensor'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },

  icon: {
    fontSize: 50,
    marginBottom: 10,
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#17202A',
  },

  subtitle: {
    fontSize: 16,
    color: '#687381',
    marginTop: 4,
  },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },

  statusText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },

  sensorCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E4EAF0',
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#17202A',
    marginBottom: 15,
  },

  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F4',
  },

  label: {
    fontSize: 15,
    color: '#687381',
    fontWeight: '600',
  },

  value: {
    fontSize: 16,
    color: '#1769AA',
    fontWeight: '800',
  },

  instruction: {
    textAlign: 'center',
    color: '#687381',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 18,
  },

  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});