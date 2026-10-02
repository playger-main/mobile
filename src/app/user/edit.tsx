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
import { SPORT_OPTIONS } from '@/constants/sports';
import { getBadgeStyle } from '@/constants/badgeStyle';

const AVATAR_SIZE = 100;

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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

  // ✅ Заполняем форму при загрузке/обновлении сессии
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
    // ✅ Точечные зависимости — не сбрасываем форму на каждый ререндер
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
        Alert.alert('Permission needed', 'We need access to your photos.');
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
        'Upload failed',
        Array.isArray(raw) ? raw.join('\n') : String(raw || 'Please try again.'),
      );
    }
  };

  const handleSave = async () => {
    Keyboard.dismiss();

    if (!username.trim()) {
      Alert.alert('Error', 'Full name cannot be empty.');
      return;
    }

    try {
      await saveProfile({
        username: username.trim(),
        bio: bio.trim(),
        city: city.trim(),
        preferredSports: sports,
      });
      Alert.alert('Success', 'Profile updated!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      const raw = e?.response?.data?.message ?? e?.message;
      const message = Array.isArray(raw)
        ? raw.join('\n')
        : String(raw || 'Could not save profile.');
      Alert.alert('Error', message);
    }
  };

  const canSave = hasChanges && username.trim().length > 0 && !isSaving;
  const avatarLetter = user?.name?.charAt(0).toUpperCase() || 'P';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* =============== HEADER =============== */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color="#006EE6" />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Edit profile</Text>
          <Text style={styles.headerSubtitle}>Update your info</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      {/* =============== SCROLL =============== */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* =============== AVATAR =============== */}
        <View style={styles.avatarSection}>
          <Pressable onPress={handlePickAvatar} style={styles.avatarPressable}>
            {user?.avatar ? (
              <Image
                key={user.avatar}
                source={{ uri: user.avatar }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{avatarLetter}</Text>
              </View>
            )}
            <View style={styles.avatarBadge}>
              {isUploading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              )}
            </View>
          </Pressable>

          <Pressable onPress={handlePickAvatar} hitSlop={8}>
            <Text style={styles.changePhotoText}>
              {isUploading ? 'Uploading…' : 'Change photo'}
            </Text>
          </Pressable>
        </View>

        {/* =============== FULL NAME =============== */}
        <Text style={styles.inputLabel}>Full name</Text>
        <TextInput
          style={styles.textField}
          value={username}
          onChangeText={setUsername}
          placeholder="Your name"
          placeholderTextColor="#BACAD6"
          maxLength={50}
          autoCapitalize="words"
        />

        {/* =============== EMAIL (read-only) =============== */}
        <Text style={styles.inputLabel}>Email</Text>
        <View style={styles.emailRow}>
          <View style={styles.emailField}>
            <Text style={styles.emailText} numberOfLines={1}>
              {user?.email || '—'}
            </Text>
            {user?.isEmailConfirmed && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#27AE60" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
          <Pressable
            style={styles.changeEmailButton}
            onPress={() => router.push('/user/change-email')}
          >
            <Text style={styles.changeEmailText}>Change</Text>
          </Pressable>
        </View>
        <Text style={styles.hintText}>
          We'll send a 6-digit code to the new address to confirm the change.
        </Text>

        {/* =============== CITY =============== */}
        <Text style={styles.inputLabel}>City</Text>
        <TextInput
          style={styles.textField}
          value={city}
          onChangeText={setCity}
          placeholder="e.g. Vilnius"
          placeholderTextColor="#BACAD6"
          maxLength={50}
          autoCapitalize="words"
        />

        {/* =============== BIO =============== */}
        <Text style={styles.inputLabel}>About me</Text>
        <TextInput
          style={styles.textareaField}
          value={bio}
          onChangeText={setBio}
          placeholder="Tell other players about yourself…"
          placeholderTextColor="#BACAD6"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={300}
        />
        <Text style={styles.counterText}>{bio.length}/300</Text>

        {/* =============== SPORTS =============== */}
        <Text style={styles.inputLabel}>Preferred sports</Text>
        <View style={styles.sportsWrap}>
          {SPORT_OPTIONS.map((sport) => {
            const active = sports.includes(sport.id);
            const badge = getBadgeStyle(sport.id);
            return (
              <Pressable
                key={sport.id}
                onPress={() => toggleSport(sport.id)}
                style={[
                  styles.sportChip,
                  active && {
                    backgroundColor: badge.bg,
                    borderColor: badge.text,
                  },
                ]}
              >
                <Ionicons
                  name={sport.icon as any}
                  size={14}
                  color={active ? badge.text : '#6080A8'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.sportChipText,
                    active && { color: badge.text, fontWeight: '700' },
                  ]}
                >
                  {sport.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.hintText}>
          Used to recommend grounds and events you'll love.
        </Text>
      </ScrollView>

      {/* =============== SAVE BUTTON (не absolute) =============== */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          style={[
            styles.saveButton,
            canSave ? styles.saveButtonActive : styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!canSave}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>
              {hasChanges ? 'Save changes' : 'No changes yet'}
            </Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  // =============== HEADER ===============
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

  // =============== SCROLL ===============
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },

  // =============== AVATAR ===============
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarPressable: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#F0F4F8',
  },
  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#006EE6',
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
    backgroundColor: '#208AEF',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#208AEF',
  },

  // =============== INPUTS ===============
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    marginTop: 16,
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
  counterText: {
    fontSize: 11,
    color: '#BACAD6',
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 4,
  },

  // =============== EMAIL ROW ===============
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emailField: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    backgroundColor: '#F8FAFC',
  },
  emailText: {
    fontSize: 14,
    color: '#334A77',
    fontWeight: '500',
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EAF9F5',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#27AE60',
    letterSpacing: 0.2,
  },
  changeEmailButton: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  changeEmailText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#208AEF',
  },
  hintText: {
    fontSize: 11,
    color: '#BACAD6',
    fontWeight: '500',
    marginTop: 6,
    lineHeight: 15,
  },

  // =============== SPORTS ===============
  sportsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  sportChipText: {
    fontSize: 13,
    color: '#334A77',
    fontWeight: '500',
  },

  // =============== BOTTOM BAR (обычный, не absolute) ===============
  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#F0F6FC',
  },
  saveButton: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonActive: { backgroundColor: '#006EE6' },
  saveButtonDisabled: { backgroundColor: '#BACAD6' },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});