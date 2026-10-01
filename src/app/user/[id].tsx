// src/app/user/[id].tsx
import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';

import { $userSession } from '@/effector/store';

export default function UserProfileScreen() {
  const { id, name: nameParam, avatar } = useLocalSearchParams<{
    id: string;
    name?: string;
    avatar?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const currentUser = useUnit($userSession);

  // ✅ Если открываем свой профиль — берём данные из сессии, иначе из params
  const isMe = currentUser?.id === id;
  const displayName = isMe
    ? currentUser?.name || 'User'
    : nameParam || 'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)/(tabs)');
  };

  // ⏳ Заглушка статистики — позже подтянем с сервера
  const stats = useMemo(
    () => ({
      events: 0,
      grounds: 0,
      joined: 0,
    }),
    [],
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#006EE6" />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + name */}
        <View style={styles.avatarSection}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarBlock}>
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </View>
          )}

          <Text style={styles.name} numberOfLines={1}>
            {displayName}
          </Text>
          {isMe && <Text style={styles.meLabel}>That's you</Text>}
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statsCard}>
            <Ionicons name="calendar-outline" size={20} color="#208AEF" />
            <Text style={styles.statsNumber}>{stats.events}</Text>
            <Text style={styles.statsLabel}>Events</Text>
          </View>
          <View style={styles.statsCard}>
            <Ionicons name="location-outline" size={20} color="#208AEF" />
            <Text style={styles.statsNumber}>{stats.grounds}</Text>
            <Text style={styles.statsLabel}>Grounds</Text>
          </View>
          <View style={styles.statsCard}>
            <Ionicons name="people-outline" size={20} color="#208AEF" />
            <Text style={styles.statsNumber}>{stats.joined}</Text>
            <Text style={styles.statsLabel}>Joined</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoBlock}>
          <Text style={styles.infoTitle}>About</Text>
          <Text style={styles.infoText}>
            Profile data will be available once the server endpoint is connected.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#334A77' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 24 },

  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarBlock: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#006EE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 12,
  },
  avatarText: { fontSize: 36, fontWeight: '800', color: '#FFFFFF' },
  name: { fontSize: 22, fontWeight: '800', color: '#334A77' },
  meLabel: {
    fontSize: 12,
    color: '#27AE60',
    fontWeight: '700',
    marginTop: 4,
  },

  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#334A77',
    marginTop: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: '#BACAD6',
    fontWeight: '500',
    marginTop: 2,
  },

  infoBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6F4FE',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334A77',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#6080A8',
    lineHeight: 19,
  },
});