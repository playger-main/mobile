// src/app/user/[id].tsx
import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import {
  $viewedUser,
  $isViewedUserLoading,
  $userSession,
  fetchPublicUserFx,
} from '@/effector/store';
import { getBadgeStyle } from '@/constants/badgeStyle';
import { getSportKey } from '@/constants/sports';
import { useTranslation } from '@/i18n';

const COVER_HEIGHT = 160;
const AVATAR_SIZE = 110;

export default function UserPublicProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();

  const user = useUnit($viewedUser);
  const isLoading = useUnit($isViewedUserLoading);
  const me = useUnit($userSession);
  const fetchUser = useUnit(fetchPublicUserFx);

  useEffect(() => {
    if (id) fetchUser(id);
  }, [id]);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)/(tabs)');
  };

  const isMe = me?.id === id;

  // LOADING
  if (isLoading && !user) {
    return (
      <View style={styles.loaderRoot}>
        <ActivityIndicator size="large" color="#208AEF" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.notFoundRoot}>
        <Ionicons name="person-outline" size={48} color="#BACAD6" />
        <Text style={styles.notFoundTitle}>
          {t('publicProfile.notFound')}
        </Text>
        <Pressable style={styles.notFoundBtn} onPress={handleBack}>
          <Text style={styles.notFoundBtnText}>
            {t('publicProfile.goBack')}
          </Text>
        </Pressable>
      </View>
    );
  }

  const avatarLetter = user.username?.charAt(0).toUpperCase() || '?';
  const sports = Array.isArray(user.preferredSports)
    ? user.preferredSports
    : [];
  const hasBio = !!user.bio && user.bio.trim().length > 0;
  const hasCity = !!user.city && user.city.trim().length > 0;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* COVER */}
        <View style={styles.coverWrapper}>
          <LinearGradient
            colors={['#006EE6', '#208AEF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cover}
          />

          <View style={[styles.overlayHeader, { paddingTop: insets.top + 6 }]}>
            <Pressable
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={12}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.headerTitle}>{t('profile.title')}</Text>
            <View style={{ width: 32 }} />
          </View>

          <View style={styles.avatarWrapper}>
            <View style={styles.avatarShadow}>
              {user.avatar ? (
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
            </View>
          </View>
        </View>

        {/* IDENTITY */}
        <View style={styles.identityBlock}>
          <Text style={styles.userName} numberOfLines={1}>
            {user.username}
          </Text>

          {hasCity && (
            <View style={styles.cityRow}>
              <Ionicons name="location-outline" size={13} color="#6080A8" />
              <Text style={styles.cityText}>{user.city}</Text>
            </View>
          )}

          {isMe && (
            <Text style={styles.youBadge}>{t('publicProfile.you')}</Text>
          )}
        </View>

        {/* BIO */}
        {hasBio && (
          <View style={styles.bioBlock}>
            <Text style={styles.bioText}>{user.bio}</Text>
          </View>
        )}

        {/* SPORTS */}
        {sports.length > 0 && (
          <View style={styles.sportsBlock}>
            <Text style={styles.sectionLabel}>
              {t('profile.preferredSports')}
            </Text>
            <View style={styles.sportsRow}>
              {sports.map((sportId) => {
                const badge = getBadgeStyle(sportId);
                const label = t(getSportKey(sportId));
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
          </View>
        )}

        {/* STATS */}
        <View style={styles.statsGrid}>
          <View style={styles.statsCard}>
            <Ionicons name="calendar-outline" size={20} color="#208AEF" />
            <Text style={styles.statsNumber}>{user.joinedCount ?? 0}</Text>
            <Text style={styles.statsLabel}>
              {t('profile.stats.joined')}
            </Text>
          </View>

          <View style={styles.statsCard}>
            <Ionicons name="trophy-outline" size={20} color="#208AEF" />
            <Text style={styles.statsNumber}>{user.gamesCount ?? 0}</Text>
            <Text style={styles.statsLabel}>
              {t('profile.stats.created')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 40 },

  loaderRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  notFoundRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    gap: 12,
    paddingHorizontal: 32,
  },
  notFoundTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#334A77',
    marginTop: 4,
  },
  notFoundBtn: {
    marginTop: 12,
    paddingHorizontal: 24,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  coverWrapper: {
    height: COVER_HEIGHT + AVATAR_SIZE / 2,
    position: 'relative',
    marginBottom: 8,
  },
  cover: { height: COVER_HEIGHT, width: '100%' },
  overlayHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  backButton: { padding: 4 },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
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
  avatarText: { fontSize: 44, fontWeight: '800', color: '#FFFFFF' },

  identityBlock: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 14,
  },
  userName: { fontSize: 20, fontWeight: '800', color: '#334A77' },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  cityText: { fontSize: 13, color: '#6080A8', fontWeight: '500' },
  youBadge: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '800',
    color: '#27AE60',
    backgroundColor: '#EAF9F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
    letterSpacing: 0.3,
  },

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

  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
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
});