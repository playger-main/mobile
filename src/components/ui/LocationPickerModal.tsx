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
import { useTheme } from '@/hooks/useTheme';

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
  const { theme, colors } = useTheme();
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
      // ignore
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={StyleSheet.absoluteFill}
          initialRegion={initialRegion}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={false}
          toolbarEnabled={false}
          userInterfaceStyle={theme === 'dark' ? 'dark' : 'light'}
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
                <View
                  style={[
                    styles.pin,
                    {
                      backgroundColor: colors.primary,
                      borderColor: colors.background,
                      shadowColor: colors.shadow,
                    },
                  ]}
                >
                  <Ionicons name="location" size={20} color="#FFFFFF" />
                </View>
                <View
                  style={[styles.pinTail, { backgroundColor: colors.primary }]}
                />
              </View>
            </Marker>
          )}
        </MapView>

        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable
            onPress={onClose}
            style={[
              styles.headerButton,
              {
                backgroundColor: colors.surface,
                shadowColor: colors.shadow,
              },
            ]}
            hitSlop={10}
          >
            <Ionicons name="close" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text
            style={[
              styles.headerTitle,
              {
                color: colors.textPrimary,
                backgroundColor: colors.surface,
              },
            ]}
          >
            {t('locationPicker.title')}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <View
          style={[styles.hintContainer, { top: insets.top + 70 }]}
          pointerEvents="none"
        >
          <View
            style={[
              styles.hintPill,
              {
                backgroundColor: colors.surface,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <Ionicons
              name="hand-left-outline"
              size={14}
              color={colors.textPrimary}
            />
            <Text style={[styles.hintText, { color: colors.textPrimary }]}>
              {t('locationPicker.hint')}
            </Text>
          </View>
        </View>

        <Pressable
          style={[
            styles.locateButton,
            {
              bottom: insets.bottom + 130,
              backgroundColor: colors.surface,
              shadowColor: colors.shadow,
            },
          ]}
          onPress={handleLocatePress}
        >
          <Ionicons name="locate" size={22} color={colors.primary} />
        </Pressable>

        <View
          style={[
            styles.bottomPanel,
            {
              paddingBottom: insets.bottom + 16,
              backgroundColor: colors.background,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <View style={styles.coordsRow}>
            <View
              style={[
                styles.coordBlock,
                {
                  backgroundColor: colors.surfaceSecondary,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[styles.coordLabel, { color: colors.textTertiary }]}
              >
                {t('locationPicker.latitude')}
              </Text>
              <Text
                style={[styles.coordValue, { color: colors.textPrimary }]}
              >
                {selectedCoords?.latitude.toFixed(5) ?? '—'}
              </Text>
            </View>
            <View
              style={[
                styles.coordBlock,
                {
                  backgroundColor: colors.surfaceSecondary,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[styles.coordLabel, { color: colors.textTertiary }]}
              >
                {t('locationPicker.longitude')}
              </Text>
              <Text
                style={[styles.coordValue, { color: colors.textPrimary }]}
              >
                {selectedCoords?.longitude.toFixed(5) ?? '—'}
              </Text>
            </View>
          </View>

          <Pressable
            style={[
              styles.confirmButton,
              {
                backgroundColor: selectedCoords
                  ? colors.primaryDark
                  : colors.textTertiary,
              },
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
  container: { flex: 1 },
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
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  hintText: { fontSize: 12, fontWeight: '500' },
  locateButton: {
    position: 'absolute',
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  coordLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  coordValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 14,
  },
  confirmButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  pinWrapper: { alignItems: 'center' },
  pin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  pinTail: {
    width: 3,
    height: 10,
    marginTop: -2,
    borderRadius: 2,
  },
});