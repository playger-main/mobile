// src/app/ground/moderate/[id].tsx
import React, { useEffect, useMemo, useState } from 'react';
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
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';

import {
  $currentGround,
  $isGroundDetailLoading,
  $moderateForm,
  $moderateHasChanges,
  $moderateIsValid,
  $moderateActiveLang,
  moderateFormInitialized,
  moderateFormReset,
  moderateFieldChanged,
  moderateSportsChanged,
  moderateCoverageChanged,
  moderateAmenitiesChanged,
  moderateGeolocationChanged,
  moderatePhotosChanged,
  moderateActiveLangChanged,
  moderateTranslateChanged,
  moderateCopyOriginalToActiveLang,
  fetchGroundByIdFx,
  updateGroundFx,
} from '@/effector/store';

import { SPORT_OPTIONS, getSportKey } from '@/constants/sports';
import { AMENITIES_OPTIONS, getAmenityKey } from '@/constants/amenities';
import { SURFACE_OPTIONS, getSurfaceKey } from '@/constants/surface';
import PhotoPicker, { PhotoInput } from '@/components/ui/PhotoPicker';
import LocationPickerModal from '@/components/ui/LocationPickerModal';
import { SUPPORTED_LANGUAGES } from '@/i18n';
import type { Language } from '@/i18n';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

export default function ModerateGroundScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const ground = useUnit($currentGround);
  const isLoading = useUnit($isGroundDetailLoading);
  const isSaving = useUnit(updateGroundFx.pending);

  const form = useUnit($moderateForm);
  const hasChanges = useUnit($moderateHasChanges);
  const isValid = useUnit($moderateIsValid);
  const activeLang = useUnit($moderateActiveLang);

  const init = useUnit(moderateFormInitialized);
  const reset = useUnit(moderateFormReset);
  const changeField = useUnit(moderateFieldChanged);
  const changeSports = useUnit(moderateSportsChanged);
  const changeCoverage = useUnit(moderateCoverageChanged);
  const changeAmenities = useUnit(moderateAmenitiesChanged);
  const changeGeolocation = useUnit(moderateGeolocationChanged);
  const changePhotos = useUnit(moderatePhotosChanged);
  const changeActiveLang = useUnit(moderateActiveLangChanged);
  const changeTranslate = useUnit(moderateTranslateChanged);
  const copyOriginal = useUnit(moderateCopyOriginalToActiveLang);

  const [locationPickerVisible, setLocationPickerVisible] = useState(false);

  // Загрузка площадки
  useEffect(() => {
    if (id) fetchGroundByIdFx(id);
  }, [id]);

  // Инициализация формы при загрузке
  useEffect(() => {
    if (!ground) return;

    const photos: PhotoInput[] = (ground.photos ?? []).map((uri, i) => ({
      uri,
      path: ground.photoPaths?.[i],
      id: ground.photoIds?.[i],
      isNew: false,
      isMain: uri === ground.avatar,
    }));

    init({
      name: ground.name || '',
      kindofsport: ground.kindofsport || [],
      coverage: ground.coverage || [],
      amenities: ground.amenities || [],
      address: ground.address || '',
      description: ground.description || '',
      descriptionTranslate: ground.descriptionTranslate || {},
      geolocation:
        ground.geolocation?.lat && ground.geolocation?.lng
          ? { lat: Number(ground.geolocation.lat), lng: Number(ground.geolocation.lng) }
          : null,
      photos,
      initialPhotoIds: ground.photoIds ?? [],
      activeLang: 'en',
    });
  }, [ground]);

  // Reset при выходе
  useEffect(() => {
    return () => reset();
  }, []);

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        t('moderate.unsavedTitle'),
        t('moderate.unsavedHint'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('moderate.discard'), style: 'destructive', onPress: () => router.back() },
        ],
      );
      return;
    }
    router.back();
  };

  const handleSave = async () => {
    if (!form || !ground) return;
    if (!hasChanges) return; // Q3: не отправляем, если нет изменений

    // Фото-логика как в edit.tsx
    const currentIds = form.photos.filter((p) => !p.isNew && p.id).map((p) => p.id!);
    const removedPhotoIds = form.initialPhotoIds.filter((id) => !currentIds.includes(id));

    const newPhotos = form.photos.filter((p) => p.isNew);
    const newUris = newPhotos.map((p) => p.uri);
    const mainNewIdx = newPhotos.findIndex((p) => p.isMain);
    const mainExisting = form.photos.find((p) => p.isMain && !p.isNew);
    const currentMainIsNew = mainNewIdx >= 0;

    try {
      await updateGroundFx({
        id: ground.id,
        name: form.name.trim(),
        kindofsport: form.kindofsport,
        address: form.address.trim(),
        coverage: form.coverage,
        description: form.description.trim() || null,
        descriptionTranslate: form.descriptionTranslate,
        amenities: form.amenities,
        geolocation: form.geolocation ?? undefined,
        newPhotoUris: newUris.length > 0 ? newUris : undefined,
        removedPhotoIds: removedPhotoIds.length > 0 ? removedPhotoIds : undefined,
        mainPhotoPath: !currentMainIsNew ? mainExisting?.path ?? null : undefined,
        mainNewPhotoIndex: currentMainIsNew ? mainNewIdx : undefined,
      });

      Alert.alert(t('common.success'), t('moderate.savedMessage'), [
        { text: t('common.ok'), onPress: () => router.back() },
      ]);
    } catch (err: any) {
      const raw = err?.response?.data?.message ?? err?.message;
      Alert.alert(
        t('common.error'),
        Array.isArray(raw) ? raw.join('\n') : String(raw || t('common.tryAgain')),
      );
    }
  };

  if (isLoading && !ground) {
    return (
      <View style={[styles.loader, { backgroundColor: colors.listBackground }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!ground || !form) return null;

  const creator = ground.creator;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.listBackground }]}
    >
      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 6,
            backgroundColor: colors.background,
            borderColor: colors.borderSubtle,
          },
        ]}
      >
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {t('moderate.title')}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
            {t('moderate.subtitle')}
          </Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* CREATOR CARD */}
        {creator && (
          <Pressable
            style={[
              styles.creatorCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() =>
              router.push({
                pathname: '/user/[id]',
                params: { id: creator.id },
              })
            }
          >
            {creator.avatar ? (
              <Image
                key={creator.avatar}
                source={{ uri: creator.avatar }}
                style={[styles.creatorAvatar, { backgroundColor: colors.surfaceSecondary }]}
              />
            ) : (
              <View style={[styles.creatorAvatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.creatorAvatarText}>
                  {creator.name?.charAt(0).toUpperCase() ?? '?'}
                </Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={[styles.creatorLabel, { color: colors.textTertiary }]}>
                {t('moderate.creator')}
              </Text>
              <Text style={[styles.creatorName, { color: colors.textPrimary }]}>
                {creator.name}
              </Text>
              {creator.email && (
                <Text style={[styles.creatorEmail, { color: colors.textSecondary }]}>
                  {creator.email}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </Pressable>
        )}

        {/* NAME */}
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          {t('groundForm.name')}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          value={form.name}
          onChangeText={(v) => changeField({ field: 'name', value: v })}
        />

        {/* ORIGINAL DESCRIPTION */}
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          {t('moderate.originalDescription')}
        </Text>
        <TextInput
          style={[
            styles.textarea,
            {
              color: colors.textPrimary,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          value={form.description}
          onChangeText={(v) => changeField({ field: 'description', value: v })}
          multiline
          textAlignVertical="top"
        />

        {/* TRANSLATIONS */}
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          {t('moderate.translations')}
        </Text>

        {/* Табы языков */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow}>
          {SUPPORTED_LANGUAGES.map(({ code }) => {
            const isActive = code === form.activeLang;
            const filled = !!form.descriptionTranslate[code]?.trim();
            return (
              <Pressable
                key={code}
                onPress={() => changeActiveLang(code as Language)}
                style={[
                  styles.tab,
                  {
                    backgroundColor: isActive ? colors.primary : colors.surface,
                    borderColor: isActive ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: isActive ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  {code.toUpperCase()}
                </Text>
                {filled && !isActive && (
                  <View style={[styles.tabDot, { backgroundColor: colors.accent }]} />
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Copy original button */}
        <Pressable
          style={[styles.copyBtn, { borderColor: colors.primary }]}
          onPress={copyOriginal}
        >
          <Ionicons name="copy-outline" size={14} color={colors.primary} />
          <Text style={[styles.copyBtnText, { color: colors.primary }]}>
            {t('moderate.copyOriginalToLang', { lang: form.activeLang.toUpperCase() })}
          </Text>
        </Pressable>

        {/* Active language input */}
        <TextInput
          style={[
            styles.textarea,
            {
              color: colors.textPrimary,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          value={form.descriptionTranslate[form.activeLang] ?? ''}
          onChangeText={(v) => changeTranslate({ lang: form.activeLang, value: v })}
          placeholder={t('moderate.translationPlaceholder', { lang: form.activeLang.toUpperCase() })}
          placeholderTextColor={colors.textTertiary}
          multiline
          textAlignVertical="top"
        />

        {/* SPORTS / SURFACES / AMENITIES — те же блоки, что в ground/edit.tsx */}
        {/* ...оставь как в ground/edit.tsx, но с useUnit domain... */}

        {/* ADDRESS */}
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          {t('groundForm.address')}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          value={form.address}
          onChangeText={(v) => changeField({ field: 'address', value: v })}
        />

        {/* LOCATION — кнопка открыть LocationPickerModal */}
        <Pressable
          style={[
            styles.locationBtn,
            { borderColor: colors.border, backgroundColor: colors.surface },
          ]}
          onPress={() => setLocationPickerVisible(true)}
        >
          <Ionicons name="location-outline" size={16} color={colors.primary} />
          <Text style={[styles.locationBtnText, { color: colors.primary }]}>
            {form.geolocation
              ? t('groundForm.tapToChange')
              : t('groundForm.tapToSelect')}
          </Text>
        </Pressable>

        {/* PHOTOS */}
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          {t('groundForm.photos')}
        </Text>
        <PhotoPicker
          photos={form.photos}
          max={5}
          onAdd={async () => {
            const ImagePicker = await import('expo-image-picker');
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
              changePhotos([
                ...form.photos,
                { uri, isNew: true, isMain: form.photos.length === 0 },
              ]);
            }
          }}
          onRemove={(index) => {
            const next = form.photos.filter((_, i) => i !== index);
            if (form.photos[index].isMain && next.length > 0) {
              next[0] = { ...next[0], isMain: true };
            }
            changePhotos(next);
          }}
          onSetMain={(index) =>
            changePhotos(form.photos.map((p, i) => ({ ...p, isMain: i === index })))
          }
        />
      </ScrollView>

      {/* SAVE */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: insets.bottom + 12,
            backgroundColor: colors.background,
            borderColor: colors.borderSubtle,
          },
        ]}
      >
        <Pressable
          style={[
            styles.saveBtn,
            {
              backgroundColor:
                hasChanges && isValid && !isSaving
                  ? colors.primaryDark
                  : colors.disabledBg,
            },
          ]}
          onPress={handleSave}
          disabled={!hasChanges || !isValid || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text
              style={[
                styles.saveBtnText,
                {
                  color:
                    hasChanges && isValid ? '#FFFFFF' : colors.textTertiary,
                },
              ]}
            >
              {hasChanges ? t('common.saveChanges') : t('common.noChangesYet')}
            </Text>
          )}
        </Pressable>
      </View>

      <LocationPickerModal
        visible={locationPickerVisible}
        initialLatitude={form.geolocation?.lat ?? null}
        initialLongitude={form.geolocation?.lng ?? null}
        onConfirm={(data) => {
          changeGeolocation({ lat: data.latitude, lng: data.longitude });
          if (data.address && !form.address.trim()) {
            changeField({ field: 'address', value: data.address });
          }
          setLocationPickerVisible(false);
        }}
        onClose={() => setLocationPickerVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: { padding: 4 },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  headerSubtitle: { fontSize: 12, fontWeight: '500', marginTop: 1 },
  scroll: { paddingHorizontal: 16, paddingTop: 16 },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  creatorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorAvatarText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  creatorLabel: { fontSize: 11, fontWeight: '500' },
  creatorName: { fontSize: 14, fontWeight: '700', marginTop: 1 },
  creatorEmail: { fontSize: 12, marginTop: 2 },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  textarea: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    lineHeight: 20,
  },
  tabsRow: { marginBottom: 8 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 6,
    position: 'relative',
  },
  tabText: { fontSize: 13, fontWeight: '700' },
  tabDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  copyBtnText: { fontSize: 12, fontWeight: '600' },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 8,
  },
  locationBtnText: { fontSize: 14, fontWeight: '600' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  saveBtn: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { fontSize: 16, fontWeight: '700' },
});