// src/components/ui/GroundPickerModal.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
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

import { $grounds, $userLocation, $cityCenter } from '@/effector/store';
import { ExtendedGroundItem } from './CardGround';
import { DEFAULT_CITY_CENTER } from '@/constants/location';
import { getSportIcon } from '@/constants/sports';

interface GroundPickerModalProps {
  visible: boolean;
  initialGroundId?: string | null;
  onConfirm: (ground: ExtendedGroundItem) => void;
  onClose: () => void;
}

export default function GroundPickerModal({
  visible,
  initialGroundId,
  onConfirm,
  onClose,
}: GroundPickerModalProps) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView | null>(null);

  const grounds = useUnit($grounds);
  const userLocation = useUnit($userLocation);
  const cityCenter = useUnit($cityCenter);

  const [selectedGround, setSelectedGround] = useState<ExtendedGroundItem | null>(null);

  // ✅ Фильтруем площадки, у которых есть координаты
  const markers = useMemo(
    () =>
      grounds.filter(
        (g) => g.geolocation?.lat && g.geolocation?.lng,
      ),
    [grounds],
  );

  // Стартовый регион
  const initialRegion: Region = {
    latitude:
      userLocation?.latitude ??
      cityCenter?.latitude ??
      DEFAULT_CITY_CENTER.latitude,
    longitude:
      userLocation?.longitude ??
      cityCenter?.longitude ??
      DEFAULT_CITY_CENTER.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // ✅ При открытии: восстанавливаем ранее выбранную площадку
  useEffect(() => {
    if (!visible) return;

    if (initialGroundId) {
      const existing = grounds.find((g) => g.id === initialGroundId);
      if (existing) {
        setSelectedGround(existing);
        if (existing.geolocation?.lat && existing.geolocation?.lng) {
          setTimeout(() => {
            mapRef.current?.animateToRegion(
              {
                latitude: Number(existing.geolocation!.lat),
                longitude: Number(existing.geolocation!.lng),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              500,
            );
          }, 300);
        }
        return;
      }
    }
    setSelectedGround(null);
  }, [visible, initialGroundId, grounds]);

  const handleMarkerPress = (ground: ExtendedGroundItem) => {
    setSelectedGround(ground);
  };

  // Центрировать на пользователе
  const handleLocatePress = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Access',
          'Enable location to see your position.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
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

      mapRef.current?.animateToRegion(
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500,
      );
    } catch {
      Alert.alert('Error', 'Could not get your current location.');
    }
  };

  const handleConfirm = () => {
    if (!selectedGround) {
      Alert.alert('Pick a ground', 'Tap on a marker to select a ground.');
      return;
    }
    onConfirm(selectedGround);
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
          showsUserLocation={true}
          showsMyLocationButton={false}
          toolbarEnabled={false}
        >
          {markers.map((g) => {
            const isSelected = selectedGround?.id === g.id;
            const sportId =
              g.kindofsport && g.kindofsport.length > 0 ? g.kindofsport[0] : 'Sport';

            return (
              <Marker
                key={g.id}
                coordinate={{
                  latitude: Number(g.geolocation!.lat),
                  longitude: Number(g.geolocation!.lng),
                }}
                onPress={() => handleMarkerPress(g)}
                tracksViewChanges={false}
              >
                <View
                  style={[
                    styles.pin,
                    isSelected ? styles.pinSelected : styles.pinDefault,
                  ]}
                >
                  <Ionicons
                    name={getSportIcon(sportId) as any}
                    size={16}
                    color="#FFFFFF"
                  />
                </View>
                <View
                  style={[
                    styles.pinTail,
                    isSelected ? styles.pinTailSelected : styles.pinTailDefault,
                  ]}
                />
              </Marker>
            );
          })}
        </MapView>

        {/* Шапка */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={onClose} style={styles.headerButton} hitSlop={10}>
            <Ionicons name="close" size={22} color="#334A77" />
          </Pressable>
          <Text style={styles.headerTitle}>Pick a ground</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Подсказка сверху */}
        <View
          style={[styles.hintContainer, { top: insets.top + 70 }]}
          pointerEvents="none"
        >
          <View style={styles.hintPill}>
            <Ionicons name="hand-left-outline" size={14} color="#334A77" />
            <Text style={styles.hintText}>
              Tap a marker to select a ground
            </Text>
          </View>
        </View>

        {/* Кнопка «моё местоположение» */}
        <Pressable
          style={[styles.locateButton, { bottom: insets.bottom + 180 }]}
          onPress={handleLocatePress}
        >
          <Ionicons name="locate" size={22} color="#208AEF" />
        </Pressable>

        {/* Нижняя панель */}
        <View
          style={[
            styles.bottomPanel,
            { paddingBottom: insets.bottom + 16 },
          ]}
        >
          {selectedGround ? (
            <View style={styles.selectedBlock}>
              <View style={styles.selectedIcon}>
                <Ionicons
                  name={
                    getSportIcon(
                      selectedGround.kindofsport?.[0] || 'Sport',
                    ) as any
                  }
                  size={18}
                  color="#FFFFFF"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.selectedName} numberOfLines={1}>
                  {selectedGround.name}
                </Text>
                {selectedGround.address ? (
                  <Text style={styles.selectedAddress} numberOfLines={1}>
                    {selectedGround.address}
                  </Text>
                ) : null}
              </View>
            </View>
          ) : (
            <View style={styles.emptyBlock}>
              <Ionicons name="information-circle-outline" size={20} color="#BACAD6" />
              <Text style={styles.emptyText}>
                No ground selected yet
              </Text>
            </View>
          )}

          <Pressable
            style={[
              styles.confirmButton,
              !selectedGround && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!selectedGround}
          >
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            <Text style={styles.confirmButtonText}>Select this ground</Text>
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

  selectedBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F0F6FC',
    borderRadius: 12,
    marginBottom: 14,
  },
  selectedIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedName: { fontSize: 14, fontWeight: '700', color: '#334A77' },
  selectedAddress: { fontSize: 12, color: '#6080A8', marginTop: 2 },

  emptyBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 14,
  },
  emptyText: { fontSize: 13, color: '#BACAD6', fontWeight: '500' },

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

  // Маркеры
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  pinDefault: {
    backgroundColor: '#208AEF',
    shadowColor: '#208AEF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  pinSelected: {
    backgroundColor: '#27AE60',
    transform: [{ scale: 1.25 }],
    shadowColor: '#27AE60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  pinTail: {
    width: 3,
    height: 8,
    borderRadius: 2,
    marginTop: -2,
  },
  pinTailDefault: { backgroundColor: '#208AEF' },
  pinTailSelected: { backgroundColor: '#27AE60' },
});