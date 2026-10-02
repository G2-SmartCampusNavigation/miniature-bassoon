import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

type DistanceDisplayProps = {
  distance: string;
};

export default function DistanceDisplay({
  distance,
}: DistanceDisplayProps) {
  return (
    <View style={styles.container}>

      <Text style={styles.label}>
        Distance from you
      </Text>

      <Text style={styles.distance}>
        {distance}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#F3F7FA',

    padding: 20,

    borderRadius: 16,

    marginVertical: 15,
  },

  label: {
    color: '#666',

    fontSize: 14,

    marginBottom: 5,
  },

  distance: {
    fontSize: 26,

    fontWeight: 'bold',

    color: '#17202A',
  },

});