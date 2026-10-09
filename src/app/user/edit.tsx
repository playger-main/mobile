// src/app/user/edit.tsx
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
  Image,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import {
  $userSession,
  updateProfileFx,
  uploadUserPhotoFx,
  fetchMyProfileFx,
} from '@/effector/store';
import { SPORT_OPTIONS, getSportKey } from '@/constants/sports';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

const AVATAR_SIZE = 100;

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const user = useUnit($userSession);
  const isSaving = useUnit(updateProfileFx.pending);
  const isUploading = useUnit(uploadUserPhotoFx.pending);

  const saveProfile = useUnit(updateProfileFx);
  const uploadPhoto = useUnit(uploadUserPhotoFx);

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [sports, setSports] = useState<string[]>([]);

  const [initial, setInitial] = useState({
    username: '',
    bio: '',
    city: '',
    sports: [] as string[],
  });

  useEffect(() => {
    if (!user) return;
    const values = {
      username: user.name || '',
      bio: user.bio || '',
      city: user.city || '',
      sports: Array.isArray(user.preferredSports) ? user.preferredSports : [],
    };
    setUsername(values.username);
    setBio(values.bio);
    setCity(values.city);
    setSports(values.sports);
    setInitial(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user?.id,
    user?.name,
    user?.bio,
    user?.city,
    user?.preferredSports,
  ]);

  const hasChanges =
    username.trim() !== initial.username ||
    bio.trim() !== initial.bio ||
    city.trim() !== initial.city ||
    JSON.stringify([...sports].sort()) !==
      JSON.stringify([...initial.sports].sort());

  const toggleSport = (sportId: string) => {
    setSports((prev) =>
      prev.includes(sportId)
        ? prev.filter((s) => s !== sportId)
        : [...prev, sportId],
    );
  };

  const handlePickAvatar = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('photos.permissionNeeded'), t('photos.accessHint'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (result.canceled) return;

      const uri = result.assets[0].uri;
      await uploadPhoto({ uri, setAsMain: true });
      await fetchMyProfileFx();
    } catch (e: any) {
      const raw = e?.response?.data?.message ?? e?.message;
      Alert.alert(
        t('profile.edit.uploadFailed'),
        Array.isArray(raw)
          ? raw.join('\n')
          : String(raw || t('common.tryAgain')),
      );
    }
  };

  const handleSave = async () => {
    Keyboard.dismiss();

    if (!username.trim()) {
      Alert.alert(t('common.error'), t('profile.edit.nameRequired'));
      return;
    }

    try {
      await saveProfile({
        username: username.trim(),
        bio: bio.trim(),
        city: city.trim(),
        preferredSports: sports,
      });
      Alert.alert(
        t('profile.edit.successTitle'),
        t('profile.edit.successMessage'),
        [{ text: t('common.ok'), onPress: () => router.back() }],
      );
    } catch (e: any) {
      const raw = e?.response?.data?.message ?? e?.message;
      const message = Array.isArray(raw)
        ? raw.join('\n')
        : String(raw || t('common.couldNotSave'));
      Alert.alert(t('common.error'), message);
    }
  };

  const canSave = hasChanges && username.trim().length > 0 && !isSaving;

  // ✅ №20
  const saveBtnBg = canSave ? colors.primaryDark : colors.disabledBg;
  const saveBtnTextColor = canSave ? '#FFFFFF' : colors.textTertiary;

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || 'P';

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
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {t('profile.edit.title')}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
            {t('profile.edit.subtitle')}
          </Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      {/* SCROLL */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* AVATAR */}
        <View style={styles.avatarSection}>
          <Pressable onPress={handlePickAvatar} style={styles.avatarPressable}>
            {user?.avatar ? (
              <Image
                key={user.avatar}
                source={{ uri: user.avatar }}
                style={[
                  styles.avatarImage,
                  { backgroundColor: colors.surfaceSecondary },
                ]}
              />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.avatarText}>{avatarLetter}</Text>
              </View>
            )}
            <View
              style={[
                styles.avatarBadge,
                {
                  backgroundColor: colors.primary,
                  borderColor: colors.background,
                },
              ]}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              )}
            </View>
          </Pressable>

          <Pressable onPress={handlePickAvatar} hitSlop={8}>
            <Text style={[styles.changePhotoText, { color: colors.primary }]}>
              {isUploading
                ? t('profile.edit.uploading')
                : t('profile.edit.changePhoto')}
            </Text>
          </Pressable>
        </View>

        {/* FULL NAME */}
        <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
          {t('profile.edit.fullName')}
        </Text>
        <TextInput
          style={[
            styles.textField,
            {
              color: colors.textPrimary,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          value={username}
          onChangeText={setUsername}
          placeholder={t('profile.edit.namePlaceholder')}
          placeholderTextColor={colors.textTertiary}
          maxLength={50}
          autoCapitalize="words"
        />

        {/* EMAIL */}
        <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
          {t('profile.edit.email')}
        </Text>
        <View style={styles.emailRow}>
          <View
            style={[
              styles.emailField,
              {
                backgroundColor: colors.surfaceSecondary,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[styles.emailText, { color: colors.textPrimary }]}
              numberOfLines={1}
            >
              {user?.email || '—'}
            </Text>
            {user?.isEmailConfirmed && (
              <View
                style={[
                  styles.verifiedBadge,
                  { backgroundColor: colors.accentBg },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={12}
                  color={colors.accent}
                />
                <Text
                  style={[styles.verifiedText, { color: colors.accent }]}
                >
                  {t('profile.edit.verified')}
                </Text>
              </View>
            )}
          </View>
          <Pressable
            style={[
              styles.changeEmailButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => router.push('/user/change-email')}
          >
            <Text
              style={[styles.changeEmailText, { color: colors.primary }]}
            >
              {t('common.change')}
            </Text>
          </Pressable>
        </View>
        <Text style={[styles.hintText, { color: colors.textTertiary }]}>
          {t('profile.edit.changeEmailHint')}
        </Text>

        {/* CITY */}
        <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
          {t('profile.edit.city')}
        </Text>
        <TextInput
          style={[
            styles.textField,
            {
              color: colors.textPrimary,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          value={city}
          onChangeText={setCity}
          placeholder={t('profile.edit.cityPlaceholder')}
          placeholderTextColor={colors.textTertiary}
          maxLength={50}
          autoCapitalize="words"
        />

        {/* BIO */}
        <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
          {t('profile.edit.aboutMe')}
        </Text>
        <TextInput
          style={[
            styles.textareaField,
            {
              color: colors.textPrimary,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          value={bio}
          onChangeText={setBio}
          placeholder={t('profile.edit.bioPlaceholder')}
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={300}
        />
        <Text style={[styles.counterText, { color: colors.textTertiary }]}>
          {bio.length}/300
        </Text>

        {/* SPORTS */}
        <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
          {t('profile.edit.preferredSports')}
        </Text>
        <View style={styles.sportsWrap}>
          {SPORT_OPTIONS.map((sport) => {
            const active = sports.includes(sport.id);
            return (
              <Pressable
                key={sport.id}
                onPress={() => toggleSport(sport.id)}
                style={[
                  styles.sportChip,
                  {
                    backgroundColor: active
                      ? colors.primary
                      : colors.surface,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={sport.icon as any}
                  size={14}
                  color={active ? '#FFFFFF' : colors.textPrimary}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.sportChipText,
                    { color: active ? '#FFFFFF' : colors.textPrimary },
                    active && { fontWeight: '700' },
                  ]}
                >
                  {t(getSportKey(sport.id))}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.hintText, { color: colors.textTertiary }]}>
          {t('profile.edit.sportsHint')}
        </Text>
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
        {/* ✅ №20: визуальный disabled */}
        <Pressable
          style={[styles.saveButton, { backgroundColor: saveBtnBg }]}
          onPress={handleSave}
          disabled={!canSave}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={[styles.saveButtonText, { color: saveBtnTextColor }]}>
              {hasChanges ? t('common.saveChanges') : t('common.noChangesYet')}
            </Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  avatarSection: { alignItems: 'center', marginBottom: 20 },
  avatarPressable: { position: 'relative', marginBottom: 10 },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 40, fontWeight: '800', color: '#FFFFFF' },
  avatarBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoText: { fontSize: 13, fontWeight: '700' },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 16,
  },
  textField: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  textareaField: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    lineHeight: 20,
  },
  counterText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 4,
  },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  emailField: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  emailText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  changeEmailButton: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeEmailText: { fontSize: 13, fontWeight: '700' },
  hintText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 6,
    lineHeight: 15,
  },
  sportsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 20,
  },
  sportChipText: { fontSize: 13, fontWeight: '500' },
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  saveButton: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});