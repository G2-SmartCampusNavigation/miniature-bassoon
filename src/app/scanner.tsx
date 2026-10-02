import { useState } from 'react';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useRouter } from 'expo-router';

import {
    CameraView,
    useCameraPermissions,
} from 'expo-camera';

import { destinations } from '../data/destinations';

export default function ScannerScreen() {
  const router = useRouter();

  const [permission, requestPermission] =
    useCameraPermissions();

  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState('');
  const [foundDestination, setFoundDestination] =
    useState<string | null>(null);

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>
          Checking camera permission...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.icon}>📷</Text>

        <Text style={styles.title}>
          Camera Permission
        </Text>

        <Text style={styles.text}>
          Camera access is needed to scan campus QR
          codes.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>
            Allow Camera
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarcodeScanned = ({
    data,
  }: {
    data: string;
  }) => {
    if (scanned) {
      return;
    }

    setScanned(true);
    setResult(data);

    const destination = destinations.find(
      (item) =>
        item.id === data ||
        item.code.toLowerCase() === data.toLowerCase() ||
        item.name.toLowerCase() === data.toLowerCase()
    );

    if (destination) {
      setFoundDestination(destination.id);
    } else {
      setFoundDestination(null);
    }
  };

  const openDestination = () => {
    if (foundDestination) {
      router.push({
        pathname: '/destination',
        params: {
          id: foundDestination,
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={
          scanned
            ? undefined
            : handleBarcodeScanned
        }
      >
        <View style={styles.overlay}>
          <View style={styles.scanBox}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>

          <Text style={styles.instruction}>
            Scan a campus QR code
          </Text>
        </View>
      </CameraView>

      {scanned && (
        <View style={styles.resultCard}>
          {foundDestination ? (
            <>
              <Text style={styles.successIcon}>
                ✅
              </Text>

              <Text style={styles.resultTitle}>
                Campus Location Found
              </Text>

              <Text style={styles.resultText}>
                {destinations.find(
                  (item) =>
                    item.id === foundDestination
                )?.name}
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={openDestination}
              >
                <Text style={styles.buttonText}>
                  View Destination
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.errorIcon}>
                ⚠️
              </Text>

              <Text style={styles.resultTitle}>
                QR Code Not Recognized
              </Text>

              <Text style={styles.resultText}>
                Scanned data: {result}
              </Text>
            </>
          )}

          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={() => {
              setScanned(false);
              setResult('');
              setFoundDestination(null);
            }}
          >
            <Text style={styles.scanAgainText}>
              Scan Again
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  camera: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 20,
  },

  cornerTopLeft: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 45,
    height: 45,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderColor: '#2E8BFF',
    borderTopLeftRadius: 20,
  },

  cornerTopRight: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 45,
    height: 45,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderColor: '#2E8BFF',
    borderTopRightRadius: 20,
  },

  cornerBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 45,
    height: 45,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderColor: '#2E8BFF',
    borderBottomLeftRadius: 20,
  },

  cornerBottomRight: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 45,
    height: 45,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderColor: '#2E8BFF',
    borderBottomRightRadius: 20,
  },

  instruction: {
    marginTop: 25,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#F5F8FC',
  },

  icon: {
    fontSize: 50,
    marginBottom: 15,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#17202A',
    marginBottom: 10,
  },

  text: {
    fontSize: 15,
    color: '#5B6573',
    textAlign: 'center',
    lineHeight: 21,
  },

  button: {
    marginTop: 15,
    backgroundColor: '#1769AA',
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  resultCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 25,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
  },

  successIcon: {
    fontSize: 35,
    textAlign: 'center',
    marginBottom: 8,
  },

  errorIcon: {
    fontSize: 35,
    textAlign: 'center',
    marginBottom: 8,
  },

  resultTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#17202A',
    textAlign: 'center',
    marginBottom: 8,
  },

  resultText: {
    fontSize: 14,
    color: '#5B6573',
    textAlign: 'center',
    marginBottom: 10,
  },

  scanAgainButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#EEF6FF',
  },

  scanAgainText: {
    color: '#1769AA',
    fontSize: 15,
    fontWeight: '700',
  },
});