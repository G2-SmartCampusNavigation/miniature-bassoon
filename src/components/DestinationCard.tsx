
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type DestinationCardProps = {
  name: string;
  code: string;
  category: string;
  description: string;
  distance: string;
  icon?: string;
  onPress: () => void;
};

export default function DestinationCard({
  name,
  code,
  category,
  description,
  distance,
  icon = '📍',
  onPress,
}: DestinationCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Top section */}
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>
            {icon}
          </Text>
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.name}>
            {name}
          </Text>

          <Text style={styles.code}>
            {code}
          </Text>

          <View style={styles.categoryRow}>
            <View style={styles.categoryDot} />

            <Text style={styles.category}>
              {category}
            </Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>
        {description}
      </Text>

      {/* Bottom section */}
      <View style={styles.bottomRow}>
        <Text style={styles.distance}>
          🚶 {distance}
        </Text>

        <View style={styles.selectButton}>
          <Text style={styles.selectText}>
            Select →
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: '#E4EAF0',

    elevation: 2,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: '#EEF6FF',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
  },

  icon: {
    fontSize: 23,
  },

  nameContainer: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#17202A',
  },

  code: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },

  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  categoryDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#2E8B57',
    marginRight: 6,
  },

  category: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },

  description: {
    color: '#5B6573',
    fontSize: 14,
    lineHeight: 20,

    marginTop: 14,
    marginBottom: 15,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  distance: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },

  selectButton: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 9,
    backgroundColor: '#EEF6FF',
  },

  selectText: {
    color: '#1769AA',
    fontSize: 14,
    fontWeight: '700',
  },
});