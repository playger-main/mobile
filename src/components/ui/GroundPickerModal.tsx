// src/components/ui/GroundPickerModal.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
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
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

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
  const { t } = useTranslation();
  const { theme, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView | null>(null);

  const grounds = useUnit($grounds);
  const userLocation = useUnit($userLocation);
  const cityCenter = useUnit($cityCenter);

  const [selectedGround, setSelectedGround] =
    useState<ExtendedGroundItem | null>(null);

  const markers = useMemo(
    () =>
      grounds.filter(
        (g) =>
          g.geolocation?.lat &&
          g.geolocation?.lng &&
          g.confirmed !== false,
      ),
    [grounds],
  );

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

  useEffect(() => {
    if (!visible) return;

    if (initialGroundId) {
      const existing = markers.find((g) => g.id === initialGroundId);
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
  }, [visible, initialGroundId, markers]);

  const handleMarkerPress = (ground: ExtendedGroundItem) => {
    setSelectedGround(ground);
  };

  const handleLocatePress = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('locationPicker.locationAccess'),
          t('groundPicker.locationAccessHint'),
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
      Alert.alert(t('common.error'), t('groundPicker.couldNotGet'));
    }
  };

  const handleConfirm = () => {
    if (!selectedGround) {
      Alert.alert(t('groundPicker.pickGround'), t('groundPicker.tapMarker'));
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={StyleSheet.absoluteFill}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
          toolbarEnabled={false}
          userInterfaceStyle={theme === 'dark' ? 'dark' : 'light'}
        >
          {markers.map((g) => {
            const isSelected = selectedGround?.id === g.id;
            const sports = Array.isArray(g.kindofsport) ? g.kindofsport : [];
            const sportId = sports.length > 0 ? sports[0] : 'Sport';
            const hasMultiple = sports.length > 1;

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
                <View style={styles.pinWrapper}>
                  <View
                    style={[
                      styles.pin,
                      {
                        backgroundColor: isSelected
                          ? colors.accent
                          : colors.primary,
                        borderColor: colors.background,
                        shadowColor: isSelected
                          ? colors.accent
                          : colors.primary,
                      },
                      isSelected && { transform: [{ scale: 1.25 }] },
                    ]}
                  >
                    <Ionicons
                      name={getSportIcon(sportId) as any}
                      size={16}
                      color="#FFFFFF"
                    />
                  </View>
                  {hasMultiple && (
                    <View
                      style={[
                        styles.multiBadge,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.primary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.multiBadgeText,
                          { color: colors.primary },
                        ]}
                      >
                        +{sports.length - 1}
                      </Text>
                    </View>
                  )}
                </View>
                <View
                  style={[
                    styles.pinTail,
                    {
                      backgroundColor: isSelected
                        ? colors.accent
                        : colors.primary,
                    },
                  ]}
                />
              </Marker>
            );
          })}
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
            {t('groundPicker.title')}
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
              {t('groundPicker.hint')}
            </Text>
          </View>
        </View>

        <Pressable
          style={[
            styles.locateButton,
            {
              bottom: insets.bottom + 180,
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
          {selectedGround ? (
            <View
              style={[
                styles.selectedBlock,
                { backgroundColor: colors.surfaceSecondary },
              ]}
            >
              <View
                style={[
                  styles.selectedIcon,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Ionicons
                  name={
                    getSportIcon(
                      Array.isArray(selectedGround.kindofsport) &&
                        selectedGround.kindofsport.length > 0
                        ? selectedGround.kindofsport[0]
                        : 'Sport',
                    ) as any
                  }
                  size={18}
                  color="#FFFFFF"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.selectedName, { color: colors.textPrimary }]}
                  numberOfLines={1}
                >
                  {selectedGround.name}
                </Text>
                {selectedGround.address ? (
                  <Text
                    style={[
                      styles.selectedAddress,
                      { color: colors.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {selectedGround.address}
                  </Text>
                ) : null}
              </View>
            </View>
          ) : (
            <View
              style={[
                styles.emptyBlock,
                { backgroundColor: colors.surfaceSecondary },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.textTertiary}
              />
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                {t('groundPicker.noSelection')}
              </Text>
            </View>
          )}

          <Pressable
            style={[
              styles.confirmButton,
              {
                backgroundColor: selectedGround
                  ? colors.primaryDark
                  : colors.textTertiary,
              },
            ]}
            onPress={handleConfirm}
            disabled={!selectedGround}
          >
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            <Text style={styles.confirmButtonText}>
              {t('groundPicker.selectButton')}
            </Text>
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
  selectedBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  selectedIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedName: { fontSize: 14, fontWeight: '700' },
  selectedAddress: { fontSize: 12, marginTop: 2 },
  emptyBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 14,
  },
  emptyText: { fontSize: 13, fontWeight: '500' },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 14,
  },
  confirmButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  pinWrapper: { position: 'relative' },
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  multiBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  multiBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 11,
  },
  pinTail: {
    width: 3,
    height: 8,
    borderRadius: 2,
    marginTop: -2,
    alignSelf: 'center',
  },
});