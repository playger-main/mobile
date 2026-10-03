// src/app/ground/edit.tsx
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import {
  fetchGroundByIdFx,
  updateGroundFx,
} from '@/effector/events/async/grounds';
import {
  $currentGround,
  $isGroundDetailLoading,
  $userSession,
} from '@/effector/store';
import LocationPickerModal from '@/components/ui/LocationPickerModal';
import PhotoPicker, { PhotoInput } from '@/components/ui/PhotoPicker';

import { SPORT_OPTIONS, getSportKey } from '@/constants/sports';
import { AMENITIES_OPTIONS, getAmenityKey } from '@/constants/amenities';
import { SURFACE_OPTIONS, getSurfaceKey } from '@/constants/surface';
import { useTranslation } from '@/i18n';

const MAX_PHOTOS = 5;

export default function EditGroundScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const ground = useUnit($currentGround);
  const isLoading = useUnit($isGroundDetailLoading);
  const isSubmitting = useUnit(updateGroundFx.pending);
  const user = useUnit($userSession);

  const [name, setName] = useState('');
  const [sports, setSports] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  const [surfaces, setSurfaces] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [photoInputs, setPhotoInputs] = useState<PhotoInput[]>([]);
  const [initialPhotoIds, setInitialPhotoIds] = useState<string[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);

  useEffect(() => {
    if (id) fetchGroundByIdFx(id);
  }, [id]);

  useEffect(() => {
    if (!ground) return;
    setName(ground.name || '');
    setSports(ground.kindofsport || []);
    setAddress(ground.address || '');
    setSurfaces(ground.coverage || []);
    setDescription(ground.description || '');
    setAmenities(ground.amenities || []);

    const photos = Array.isArray(ground.photos) ? ground.photos : [];
    const paths = Array.isArray(ground.photoPaths) ? ground.photoPaths : [];
    const ids = Array.isArray(ground.photoIds) ? ground.photoIds : [];

    setPhotoInputs(
      photos.map((uri, i) => ({
        uri,
        path: paths[i],
        id: ids[i],
        isNew: false,
        isMain: uri === ground.avatar,
      })),
    );
    setInitialPhotoIds(ids);

    if (ground.geolocation?.lat && ground.geolocation?.lng) {
      setLocation({
        lat: Number(ground.geolocation.lat),
        lng: Number(ground.geolocation.lng),
      });
    }
  }, [ground]);

  const pickImage = async () => {
    if (photoInputs.length >= MAX_PHOTOS) {
      Alert.alert(
        t('photos.maxPhotos'),
        t('photos.upToN', { count: MAX_PHOTOS }),
      );
      return;
    }
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('photos.permissionNeeded'), t('photos.accessHint'));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhotoInputs((prev) => [
        ...prev,
        { uri, isNew: true, isMain: prev.length === 0 },
      ]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotoInputs((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (prev[index].isMain && next.length > 0) {
        next[0] = { ...next[0], isMain: true };
      }
      return next;
    });
  };

  const setMainPhoto = (index: number) => {
    setPhotoInputs((prev) =>
      prev.map((p, i) => ({ ...p, isMain: i === index })),
    );
  };

  const toggleSport = (sportId: string) => {
    setSports((prev) =>
      prev.includes(sportId)
        ? prev.filter((s) => s !== sportId)
        : [...prev, sportId],
    );
  };

  const toggleSurface = (surfaceId: string) => {
    setSurfaces((prev) =>
      prev.includes(surfaceId)
        ? prev.filter((s) => s !== surfaceId)
        : [...prev, surfaceId],
    );
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  const handleConfirmLocation = (data: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => {
    setLocation({ lat: data.latitude, lng: data.longitude });
    if (data.address && !address.trim()) {
      setAddress(data.address);
    }
    setLocationPickerVisible(false);
  };

  const handleSave = async () => {
    if (!name.trim())
      return Alert.alert(t('common.error'), t('groundForm.nameRequired'));
    if (sports.length === 0)
      return Alert.alert(t('common.error'), t('groundForm.sportRequired'));
    if (!location)
      return Alert.alert(t('common.error'), t('groundForm.locationRequired'));
    if (!address.trim())
      return Alert.alert(t('common.error'), t('groundForm.addressRequired'));

    const currentIds = photoInputs
      .filter((p) => !p.isNew && p.id)
      .map((p) => p.id!);
    const removedPhotoIds = initialPhotoIds.filter(
      (i) => !currentIds.includes(i),
    );

    const newPhotos = photoInputs.filter((p) => p.isNew);
    const newUris = newPhotos.map((p) => p.uri);
    const mainNewIdx = newPhotos.findIndex((p) => p.isMain);
    const mainExisting = photoInputs.find((p) => p.isMain && !p.isNew);

    const currentMainIsNew = mainNewIdx >= 0;

    try {
      await updateGroundFx({
        id: id!,
        name: name.trim(),
        kindofsport: sports,
        address: address.trim(),
        coverage: surfaces,
        description: description.trim() || undefined,
        amenities,
        geolocation: location,
        newPhotoUris: newUris.length > 0 ? newUris : undefined,
        removedPhotoIds:
          removedPhotoIds.length > 0 ? removedPhotoIds : undefined,
        mainPhotoPath: !currentMainIsNew ? mainExisting?.path ?? null : undefined,
        mainNewPhotoIndex: currentMainIsNew ? mainNewIdx : undefined,
      });

      Alert.alert(t('common.success'), t('groundForm.updateSuccess'), [
        { text: t('common.ok'), onPress: () => router.back() },
      ]);
    } catch (err: any) {
      const raw = err?.response?.data?.message ?? err?.message ?? err;
      const message = Array.isArray(raw) ? raw.join('\n') : String(raw);
      Alert.alert(t('common.error'), message || t('groundForm.updateFailed'));
    }
  };

  const isFormValid =
    name.trim().length > 0 &&
    sports.length > 0 &&
    location !== null &&
    address.trim().length > 0;

  if (isLoading && !ground) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#208AEF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color="#006EE6" />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{t('ground.edit.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('ground.edit.subtitle')}</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
      >
        {/* NAME */}
        <Text style={styles.inputLabel}>{t('groundForm.name')}</Text>
        <TextInput
          style={styles.textField}
          placeholder={t('groundForm.namePlaceholder')}
          placeholderTextColor="#BACAD6"
          value={name}
          onChangeText={setName}
        />

        {/* SPORT */}
        <View style={styles.labelWithHintRow}>
          <Text style={styles.inputLabel}>{t('groundForm.sport')}</Text>
          {sports.length > 0 && (
            <Text style={styles.selectedCountHint}>
              {t('groundForm.selected', { count: sports.length })}
            </Text>
          )}
        </View>
        <View style={styles.gridContainer}>
          {SPORT_OPTIONS.map((sport) => {
            const isSelected = sports.includes(sport.id);
            return (
              <Pressable
                key={sport.id}
                onPress={() => toggleSport(sport.id)}
                style={[
                  styles.sportCard,
                  isSelected && styles.sportCardSelected,
                ]}
              >
                <Ionicons
                  name={sport.icon as any}
                  size={24}
                  color={isSelected ? '#208AEF' : '#6080A8'}
                />
                <Text
                  style={[
                    styles.sportLabel,
                    isSelected && styles.sportLabelSelected,
                  ]}
                  numberOfLines={1}
                >
                  {t(getSportKey(sport.id))}
                </Text>
                {isSelected && (
                  <View style={styles.sportCheckmark}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* LOCATION */}
        <View style={styles.labelWithHintRow}>
          <Text style={styles.inputLabel}>{t('groundForm.location')}</Text>
          {location && (
            <Text style={styles.selectedCountHint}>
              {t('groundForm.locationSet')}
            </Text>
          )}
        </View>
        <Pressable
          style={styles.mapPickerBox}
          onPress={() => setLocationPickerVisible(true)}
        >
          {location ? (
            <View style={styles.locationSetContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#27AE60" />
              <View style={{ flex: 1 }}>
                <Text style={styles.locationSetText}>
                  {t('groundForm.coordinates', {
                    lat: location.lat.toFixed(5),
                    lng: location.lng.toFixed(5),
                  })}
                </Text>
                <Text style={styles.locationChangeHint}>
                  {t('groundForm.tapToChange')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#BACAD6" />
            </View>
          ) : (
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map-outline" size={24} color="#208AEF" />
              <Text style={styles.mapPlaceholderText}>
                {t('groundForm.tapToSelect')}
              </Text>
            </View>
          )}
        </Pressable>
        <Text style={styles.hintText}>{t('groundForm.locationHintEdit')}</Text>

        {/* ADDRESS */}
        <Text style={styles.inputLabel}>{t('groundForm.address')}</Text>
        <TextInput
          style={styles.textField}
          placeholder={t('groundForm.addressPlaceholder')}
          placeholderTextColor="#BACAD6"
          value={address}
          onChangeText={setAddress}
        />

        {/* SURFACE */}
        <View style={styles.labelWithHintRow}>
          <Text style={styles.inputLabel}>{t('groundForm.surface')}</Text>
          {surfaces.length > 0 && (
            <Text style={styles.selectedCountHint}>
              {t('groundForm.selected', { count: surfaces.length })}
            </Text>
          )}
        </View>
        <View style={styles.surfaceWrap}>
          {SURFACE_OPTIONS.map((s) => {
            const isSelected = surfaces.includes(s.id);
            return (
              <Pressable
                key={s.id}
                onPress={() => toggleSurface(s.id)}
                style={[
                  styles.surfaceChip,
                  isSelected && styles.surfaceChipSelected,
                ]}
              >
                <Ionicons
                  name={s.icon as any}
                  size={14}
                  color={isSelected ? '#FFFFFF' : '#334A77'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.surfaceChipText,
                    isSelected && styles.surfaceChipTextSelected,
                  ]}
                >
                  {t(getSurfaceKey(s.id))}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* DESCRIPTION */}
        <Text style={styles.inputLabel}>{t('groundForm.description')}</Text>
        <TextInput
          style={styles.textareaField}
          placeholder={t('groundForm.descriptionPlaceholder')}
          placeholderTextColor="#BACAD6"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        {/* AMENITIES */}
        <Text style={styles.inputLabel}>{t('groundForm.amenities')}</Text>
        <View style={styles.amenitiesWrap}>
          {AMENITIES_OPTIONS.map((amenity) => {
            const isSelected = amenities.includes(amenity);
            return (
              <Pressable
                key={amenity}
                onPress={() => toggleAmenity(amenity)}
                style={[
                  styles.amenityChip,
                  isSelected && styles.amenityChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.amenityText,
                    isSelected && styles.amenityTextSelected,
                  ]}
                >
                  {t(getAmenityKey(amenity))}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* PHOTOS */}
        <Text style={styles.inputLabel}>{t('groundForm.photos')}</Text>
        <PhotoPicker
          photos={photoInputs}
          max={MAX_PHOTOS}
          onAdd={pickImage}
          onRemove={removePhoto}
          onSetMain={setMainPhoto}
        />

        {/* MODERATION NOTICE */}
        {!user?.role?.includes('moderator') &&
          !user?.role?.includes('admin') && (
            <View style={styles.moderationNotice}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#FF8000"
              />
              <Text style={styles.moderationNoticeText}>
                {t('groundForm.moderationNotice')}
              </Text>
            </View>
          )}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          style={[
            styles.publishButton,
            isFormValid
              ? styles.publishButtonActive
              : styles.publishButtonDisabled,
            isSubmitting && styles.buttonDisabled,
          ]}
          onPress={handleSave}
          disabled={isSubmitting || !isFormValid}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.publishButtonText}>
              {t('common.saveChanges')}
            </Text>
          )}
        </Pressable>
      </View>

      <LocationPickerModal
        visible={locationPickerVisible}
        initialLatitude={location?.lat ?? null}
        initialLongitude={location?.lng ?? null}
        onConfirm={handleConfirmLocation}
        onClose={() => setLocationPickerVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#F0F6FC',
    backgroundColor: '#FFFFFF',
  },
  backButton: { padding: 4 },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#334A77' },
  headerSubtitle: {
    fontSize: 12,
    color: '#BACAD6',
    fontWeight: '500',
    marginTop: 1,
  },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    marginTop: 16,
  },
  labelWithHintRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 16,
    marginBottom: 8,
  },
  selectedCountHint: {
    fontSize: 12,
    fontWeight: '600',
    color: '#208AEF',
    marginBottom: 8,
  },
  textField: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#334A77',
    backgroundColor: '#FFFFFF',
  },
  textareaField: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#334A77',
    backgroundColor: '#FFFFFF',
    lineHeight: 20,
  },
  hintText: {
    fontSize: 11,
    color: '#BACAD6',
    fontWeight: '500',
    marginTop: 6,
    lineHeight: 15,
  },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sportCard: {
    width: '30%',
    height: 92,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    paddingHorizontal: 4,
  },
  sportCardSelected: { borderColor: '#208AEF', backgroundColor: '#F0F6FC' },
  sportLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6080A8',
    marginTop: 4,
    textAlign: 'center',
  },
  sportLabelSelected: { color: '#208AEF', fontWeight: '700' },
  sportCheckmark: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  surfaceWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  surfaceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  surfaceChipSelected: { backgroundColor: '#208AEF', borderColor: '#208AEF' },
  surfaceChipText: { fontSize: 13, color: '#334A77', fontWeight: '500' },
  surfaceChipTextSelected: { color: '#FFFFFF', fontWeight: '600' },
  amenitiesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  amenityChipSelected: { backgroundColor: '#208AEF', borderColor: '#208AEF' },
  amenityText: { fontSize: 13, color: '#334A77', fontWeight: '500' },
  amenityTextSelected: { color: '#FFFFFF', fontWeight: '600' },
  mapPickerBox: {
    width: '100%',
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  mapPlaceholder: { alignItems: 'center', gap: 6 },
  mapPlaceholderText: { fontSize: 13, color: '#208AEF', fontWeight: '600' },
  locationSetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  locationSetText: { fontSize: 13, color: '#27AE60', fontWeight: '700' },
  locationChangeHint: {
    fontSize: 11,
    color: '#6080A8',
    fontWeight: '500',
    marginTop: 2,
  },
  moderationNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFF8EC',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    borderRadius: 12,
    padding: 12,
    marginTop: 20,
  },
  moderationNoticeText: {
    flex: 1,
    fontSize: 12,
    color: '#B45F06',
    fontWeight: '500',
    lineHeight: 17,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#F0F6FC',
    zIndex: 99,
  },
  publishButton: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishButtonActive: { backgroundColor: '#006EE6' },
  publishButtonDisabled: { backgroundColor: '#BACAD6' },
  publishButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  buttonDisabled: { backgroundColor: '#BACAD6' },
});