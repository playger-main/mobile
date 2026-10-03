// src/components/ui/LocationPickerModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useUnit } from 'effector-react';

import { $userLocation, $cityCenter } from '@/effector/store';
import { DEFAULT_CITY_CENTER } from '@/constants/location';
import { useTranslation } from '@/i18n';

interface LocationPickerModalProps {
  visible: boolean;
  initialLatitude?: number | null;
  initialLongitude?: number | null;
  onConfirm: (data: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => void;
  onClose: () => void;
}

export default function LocationPickerModal({
  visible,
  initialLatitude,
  initialLongitude,
  onConfirm,
  onClose,
}: LocationPickerModalProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView | null>(null);

  const userLocation = useUnit($userLocation);
  const cityCenter = useUnit($cityCenter);

  const [selectedCoords, setSelectedCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [isGeocoding, setIsGeocoding] = useState(false);

  const initialRegion: Region = {
    latitude:
      initialLatitude ??
      userLocation?.latitude ??
      cityCenter?.latitude ??
      DEFAULT_CITY_CENTER.latitude,
    longitude:
      initialLongitude ??
      userLocation?.longitude ??
      cityCenter?.longitude ??
      DEFAULT_CITY_CENTER.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  useEffect(() => {
    if (visible) {
      if (initialLatitude != null && initialLongitude != null) {
        setSelectedCoords({
          latitude: initialLatitude,
          longitude: initialLongitude,
        });
      } else {
        setSelectedCoords(null);
      }
    }
  }, [visible, initialLatitude, initialLongitude]);

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedCoords({ latitude, longitude });
  };

  const handleLocatePress = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('locationPicker.locationAccess'),
          t('locationPicker.enableLocation'),
          [
            { text: t('locationPicker.notNow'), style: 'cancel' },
            {
              text: t('locationPicker.openSettings'),
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ],
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setSelectedCoords(coords);

      mapRef.current?.animateToRegion(
        {
          ...coords,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        },
        500,
      );
    } catch {
      Alert.alert(t('common.error'), t('locationPicker.couldNotGet'));
    }
  };

  const handleConfirm = async () => {
    if (!selectedCoords) {
      Alert.alert(
        t('locationPicker.chooseSpot'),
        t('locationPicker.tapHint'),
      );
      return;
    }

    setIsGeocoding(true);

    let address: string | undefined;

    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude: selectedCoords.latitude,
        longitude: selectedCoords.longitude,
      });

      const first = addresses?.[0];
      if (first) {
        const parts = [
          first.street,
          first.streetNumber,
          first.district,
          first.city,
        ].filter(Boolean);
        address = parts.join(', ') || undefined;
      }
    } catch {
      // Игнорируем — адрес опционален
    }

    setIsGeocoding(false);

    onConfirm({
      latitude: selectedCoords.latitude,
      longitude: selectedCoords.longitude,
      address,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={StyleSheet.absoluteFill}
          initialRegion={initialRegion}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={false}
          toolbarEnabled={false}
        >
          {selectedCoords && (
            <Marker
              coordinate={selectedCoords}
              draggable
              onDragEnd={(e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;
                setSelectedCoords({ latitude, longitude });
              }}
            >
              <View style={styles.pinWrapper}>
                <View style={styles.pin}>
                  <Ionicons name="location" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.pinTail} />
              </View>
            </Marker>
          )}
        </MapView>

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={onClose} style={styles.headerButton} hitSlop={10}>
            <Ionicons name="close" size={22} color="#334A77" />
          </Pressable>
          <Text style={styles.headerTitle}>
            {t('locationPicker.title')}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Hint */}
        <View
          style={[styles.hintContainer, { top: insets.top + 70 }]}
          pointerEvents="none"
        >
          <View style={styles.hintPill}>
            <Ionicons name="hand-left-outline" size={14} color="#334A77" />
            <Text style={styles.hintText}>{t('locationPicker.hint')}</Text>
          </View>
        </View>

        {/* Locate button */}
        <Pressable
          style={[styles.locateButton, { bottom: insets.bottom + 130 }]}
          onPress={handleLocatePress}
        >
          <Ionicons name="locate" size={22} color="#208AEF" />
        </Pressable>

        {/* Bottom panel */}
        <View
          style={[styles.bottomPanel, { paddingBottom: insets.bottom + 16 }]}
        >
          <View style={styles.coordsRow}>
            <View style={styles.coordBlock}>
              <Text style={styles.coordLabel}>
                {t('locationPicker.latitude')}
              </Text>
              <Text style={styles.coordValue}>
                {selectedCoords?.latitude.toFixed(5) ?? '—'}
              </Text>
            </View>
            <View style={styles.coordBlock}>
              <Text style={styles.coordLabel}>
                {t('locationPicker.longitude')}
              </Text>
              <Text style={styles.coordValue}>
                {selectedCoords?.longitude.toFixed(5) ?? '—'}
              </Text>
            </View>
          </View>

          <Pressable
            style={[
              styles.confirmButton,
              !selectedCoords && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!selectedCoords || isGeocoding}
          >
            {isGeocoding ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                <Text style={styles.confirmButtonText}>
                  {t('locationPicker.confirmButton')}
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#334A77',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#334A77',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  hintContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#334A77',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  hintText: { fontSize: 12, color: '#334A77', fontWeight: '500' },
  locateButton: {
    position: 'absolute',
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#334A77',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  bottomPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#334A77',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 16,
  },
  coordsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  coordBlock: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  coordLabel: {
    fontSize: 11,
    color: '#BACAD6',
    fontWeight: '500',
    marginBottom: 2,
  },
  coordValue: {
    fontSize: 14,
    color: '#334A77',
    fontWeight: '700',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#006EE6',
  },
  confirmButtonDisabled: { backgroundColor: '#BACAD6' },
  confirmButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  pinWrapper: { alignItems: 'center' },
  pin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  pinTail: {
    width: 3,
    height: 10,
    backgroundColor: '#208AEF',
    marginTop: -2,
    borderRadius: 2,
  },
});