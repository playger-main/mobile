// src/components/ui/UserProfile.tsx
import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useUnit } from 'effector-react';

import { SessionUser } from '@/effector/domains/auth';
import { fetchMyProfileFx } from '@/effector/events/async/users';
import { getBadgeStyle } from '@/constants/badgeStyle';
import { getSportLabel } from '@/constants/sports';

interface UserProfileProps {
  user: SessionUser;
  onLogout: () => void;
}

const COVER_HEIGHT = 160;
const AVATAR_SIZE = 140;

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const fetchProfile = useUnit(fetchMyProfileFx);
  const isRefreshing = useUnit(fetchMyProfileFx.pending);

  // ✅ Обновляем профиль при каждом фокусе на вкладке
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, []),
  );

  const avatarLetter = user.name ? user.name.charAt(0).toUpperCase() : 'P';
  const hasAvatar = !!user.avatar;

  const joinedCount = user.joinedCount ?? 0;
  const savedCount = user.savedCount ?? 0;
  const gamesCount = user.gamesCount ?? 0;

  const isModerator =
    user.role?.includes('moderator') || user.role?.includes('admin');

  const sports: string[] = Array.isArray(user.preferredSports)
    ? user.preferredSports
    : [];

  const hasBio = !!user.bio && user.bio.trim().length > 0;
  const hasCity = !!user.city && user.city.trim().length > 0;

  const goToEdit = () => router.push('/user/edit');

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* COVER + AVATAR */}
        <View style={styles.coverWrapper}>
          <LinearGradient
            colors={['#006EE6', '#208AEF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cover}
          />

          <View style={styles.avatarWrapper}>
            <Pressable onPress={goToEdit} style={styles.avatarShadow}>
              {hasAvatar ? (
                <Image
                  key={user.avatar!}
                  source={{ uri: user.avatar! }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{avatarLetter}</Text>
                </View>
              )}
            </Pressable>
          </View>

          {isRefreshing && (
            <View style={styles.refreshBadge}>
              <ActivityIndicator size="small" color="#FFFFFF" />
            </View>
          )}
        </View>

        {/* IDENTITY */}
        <View style={styles.identityBlock}>
          <Text style={styles.userName} numberOfLines={1}>
            {user.name || 'PlayG User'}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {user.email || '—'}
          </Text>

          <Pressable style={styles.cityRow} onPress={goToEdit}>
            <Ionicons name="location-outline" size={13} color="#6080A8" />
            <Text style={[styles.cityText, !hasCity && styles.cityEmpty]}>
              {hasCity ? user.city : 'Add your city'}
            </Text>
          </Pressable>
        </View>

        {/* BIO */}
        <View style={styles.bioBlock}>
          {hasBio ? (
            <Text style={styles.bioText}>{user.bio}</Text>
          ) : (
            <Pressable onPress={goToEdit}>
              <Text style={styles.bioEmptyText}>
                + Add a short bio — tell other players about yourself
              </Text>
            </Pressable>
          )}
        </View>

        {/* SPORTS */}
        <View style={styles.sportsBlock}>
          <Text style={styles.sectionLabel}>PREFERRED SPORTS</Text>
          {sports.length > 0 ? (
            <View style={styles.sportsRow}>
              {sports.map((sportId) => {
                const badge = getBadgeStyle(sportId);
                const label = getSportLabel(sportId);
                return (
                  <View
                    key={sportId}
                    style={[styles.sportChip, { backgroundColor: badge.bg }]}
                  >
                    <View
                      style={[styles.sportDot, { backgroundColor: badge.text }]}
                    />
                    <Text style={[styles.sportText, { color: badge.text }]}>
                      {label.toUpperCase()}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Pressable onPress={goToEdit}>
              <Text style={styles.emptyHintText}>
                + Choose sports you usually play
              </Text>
            </Pressable>
          )}
        </View>

        {/* STATS — кликабельные */}
        <View style={styles.statsGrid}>
          <Pressable
            style={styles.statsCard}
            onPress={() => router.push('/user/joined')}
          >
            <Ionicons name="calendar-outline" size={20} color="#208AEF" />
            <Text style={styles.statsNumber}>{joinedCount}</Text>
            <Text style={styles.statsLabel}>Joined</Text>
          </Pressable>

          <Pressable
            style={styles.statsCard}
            onPress={() => router.push('/user/favorites')}
          >
            <Ionicons name="heart-outline" size={20} color="#208AEF" />
            <Text style={styles.statsNumber}>{savedCount}</Text>
            <Text style={styles.statsLabel}>Saved</Text>
          </Pressable>

          <Pressable
            style={styles.statsCard}
            onPress={() => router.push('/user/created')}
          >
            <Ionicons name="trophy-outline" size={20} color="#208AEF" />
            <Text style={styles.statsNumber}>{gamesCount}</Text>
            <Text style={styles.statsLabel}>Created</Text>
          </Pressable>
        </View>

        {/* MENU */}
        <View style={styles.menuContainer}>
          <Pressable style={styles.menuItem} onPress={goToEdit}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="create-outline"
                size={20}
                color="#6080A8"
                style={styles.menuIcon}
              />
              <Text style={styles.menuItemText}>Edit profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#BACAD6" />
          </Pressable>

          {isModerator && (
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push('/ground/moderation')}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="#FF8000"
                  style={styles.menuIcon}
                />
                <Text style={[styles.menuItemText, { color: '#FF8000' }]}>
                  Moderation
                </Text>
              </View>
              <View style={styles.menuItemRight}>
                <View style={styles.moderationDot} />
                <Ionicons name="chevron-forward" size={16} color="#BACAD6" />
              </View>
            </Pressable>
          )}

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push('/(drawer)/settings')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="settings-outline"
                size={20}
                color="#6080A8"
                style={styles.menuIcon}
              />
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#BACAD6" />
          </Pressable>

          <Pressable
            style={[styles.menuItem, styles.noBorder]}
            onPress={() => router.push('/(drawer)/about')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#6080A8"
                style={styles.menuIcon}
              />
              <Text style={styles.menuItemText}>About PlayG</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#BACAD6" />
          </Pressable>
        </View>

        {/* LOGOUT */}
        <Pressable style={styles.logoutButton} onPress={onLogout}>
          <Ionicons
            name="log-out-outline"
            size={18}
            color="#FF3B30"
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutButtonText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 40 },

  coverWrapper: {
    height: COVER_HEIGHT + AVATAR_SIZE / 2,
    position: 'relative',
    marginBottom: 8,
  },
  cover: { height: COVER_HEIGHT, width: '100%' },
  avatarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  avatarShadow: {
    shadowColor: '#334A77',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#F0F4F8',
  },
  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#006EE6',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 48, fontWeight: '800', color: '#FFFFFF' },
  refreshBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  identityBlock: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 14,
  },
  userName: { fontSize: 20, fontWeight: '800', color: '#334A77' },
  userEmail: { fontSize: 13, color: '#6080A8', marginTop: 3 },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  cityText: { fontSize: 13, color: '#6080A8', fontWeight: '500' },
  cityEmpty: { color: '#208AEF', fontWeight: '600' },

  bioBlock: {
    marginHorizontal: 16,
    marginTop: 18,
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6F4FE',
  },
  bioText: { fontSize: 13, color: '#334A77', lineHeight: 19 },
  bioEmptyText: {
    fontSize: 13,
    color: '#208AEF',
    fontWeight: '600',
    lineHeight: 19,
  },

  sportsBlock: { marginTop: 18, paddingHorizontal: 16 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#BACAD6',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sportsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  sportDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  sportText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  emptyHintText: { fontSize: 12, color: '#208AEF', fontWeight: '600' },

  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
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

  menuContainer: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#F0F6FC',
  },
  noBorder: { borderBottomWidth: 0 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { marginRight: 12 },
  menuItemText: { fontSize: 14, fontWeight: '600', color: '#334A77' },
  menuItemRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  moderationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF8000',
    marginRight: 8,
  },

  logoutButton: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    backgroundColor: '#FFFFFF',
  },
  logoutIcon: { marginRight: 8 },
  logoutButtonText: { color: '#FF3B30', fontSize: 15, fontWeight: '700' },
});