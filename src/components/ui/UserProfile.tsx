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
import { getSportKey } from '@/constants/sports';
import { $myReviewsCount, fetchMyReviewsFx } from '@/effector/store';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

interface UserProfileProps {
  user: SessionUser;
  onLogout: () => void;
}

const COVER_HEIGHT = 160;
const AVATAR_SIZE = 140;

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  const { t } = useTranslation();
  const { theme, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const fetchProfile = useUnit(fetchMyProfileFx);
  const isRefreshing = useUnit(fetchMyProfileFx.pending);
  const reviewsCount = useUnit($myReviewsCount);
  const fetchMyReviews = useUnit(fetchMyReviewsFx);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      fetchMyReviews();
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

  const coverColors: [string, string] =
    theme === 'dark' ? ['#16283D', '#208AEF'] : ['#006EE6', '#208AEF'];

  return (
    <View style={[styles.container, { backgroundColor: colors.listBackground }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* COVER + AVATAR */}
        <View style={styles.coverWrapper}>
          <LinearGradient
            colors={coverColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cover}
          />

          <View style={styles.avatarWrapper}>
            <Pressable
              onPress={goToEdit}
              style={[styles.avatarShadow, { shadowColor: colors.shadow }]}
            >
              {hasAvatar ? (
                <Image
                  key={user.avatar!}
                  source={{ uri: user.avatar! }}
                  style={[styles.avatarImage, { borderColor: colors.surface }]}
                />
              ) : (
                <View
                  style={[
                    styles.avatarPlaceholder,
                    {
                      borderColor: colors.surface,
                      backgroundColor: colors.primaryDark,
                    },
                  ]}
                >
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
          <Text
            style={[styles.userName, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {user.name || 'PlayG User'}
          </Text>
          <Text
            style={[styles.userEmail, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {user.email || '—'}
          </Text>

          <Pressable style={styles.cityRow} onPress={goToEdit}>
            <Ionicons
              name="location-outline"
              size={13}
              color={colors.textSecondary}
            />
            <Text
              style={[
                styles.cityText,
                { color: hasCity ? colors.textSecondary : colors.primary },
              ]}
            >
              {hasCity ? user.city : t('profile.addCity')}
            </Text>
          </Pressable>
        </View>

        {/* BIO — теперь карточка (surface), а не surfaceSecondary */}
        <View
          style={[
            styles.bioBlock,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {hasBio ? (
            <Text style={[styles.bioText, { color: colors.textPrimary }]}>
              {user.bio}
            </Text>
          ) : (
            <Pressable onPress={goToEdit}>
              <Text style={[styles.bioEmptyText, { color: colors.primary }]}>
                {t('profile.addBio')}
              </Text>
            </Pressable>
          )}
        </View>

        {/* SPORTS */}
        <View style={styles.sportsBlock}>
          <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>
            {t('profile.preferredSports')}
          </Text>
          {sports.length > 0 ? (
            <View style={styles.sportsRow}>
              {sports.map((sportId) => {
                const badge = getBadgeStyle(sportId, theme);
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
          ) : (
            <Pressable onPress={goToEdit}>
              <Text style={[styles.emptyHintText, { color: colors.primary }]}>
                {t('profile.addSports')}
              </Text>
            </Pressable>
          )}
        </View>

        {/* STATS */}
        <View style={styles.statsGrid}>
          <Pressable
            style={[
              styles.statsCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => router.push('/user/joined')}
          >
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <Text style={[styles.statsNumber, { color: colors.textPrimary }]}>
              {joinedCount}
            </Text>
            <Text style={[styles.statsLabel, { color: colors.textTertiary }]}>
              {t('profile.stats.joined')}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.statsCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => router.push('/user/favorites')}
          >
            <Ionicons name="heart-outline" size={18} color={colors.primary} />
            <Text style={[styles.statsNumber, { color: colors.textPrimary }]}>
              {savedCount}
            </Text>
            <Text style={[styles.statsLabel, { color: colors.textTertiary }]}>
              {t('profile.stats.saved')}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.statsCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => router.push('/user/created')}
          >
            <Ionicons name="trophy-outline" size={18} color={colors.primary} />
            <Text style={[styles.statsNumber, { color: colors.textPrimary }]}>
              {gamesCount}
            </Text>
            <Text style={[styles.statsLabel, { color: colors.textTertiary }]}>
              {t('profile.stats.created')}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.statsCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => router.push('/user/reviews')}
          >
            <Ionicons name="star-outline" size={18} color={colors.primary} />
            <Text style={[styles.statsNumber, { color: colors.textPrimary }]}>
              {reviewsCount}
            </Text>
            <Text style={[styles.statsLabel, { color: colors.textTertiary }]}>
              {t('profile.stats.reviews')}
            </Text>
          </Pressable>
        </View>

        {/* MENU */}
        <View
          style={[
            styles.menuContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Pressable
            style={[styles.menuItem, { borderColor: colors.borderSubtle }]}
            onPress={goToEdit}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="create-outline"
                size={20}
                color={colors.textSecondary}
                style={styles.menuIcon}
              />
              <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>
                {t('profile.menu.editProfile')}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textTertiary}
            />
          </Pressable>

          {isModerator && (
            <Pressable
              style={[
                styles.menuItem,
                !isModerator && styles.noBorder,
                { borderColor: colors.borderSubtle },
              ]}
              onPress={() => router.push('/ground/moderation')}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color={colors.warning}
                  style={styles.menuIcon}
                />
                <Text style={[styles.menuItemText, { color: colors.warning }]}>
                  {t('profile.menu.moderation')}
                </Text>
              </View>
              <View style={styles.menuItemRight}>
                <View
                  style={[
                    styles.moderationDot,
                    { backgroundColor: colors.warning },
                  ]}
                />
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.textTertiary}
                />
              </View>
            </Pressable>
          )}
        </View>

        {/* LOGOUT */}
        <Pressable
          style={[
            styles.logoutButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={onLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={18}
            color={colors.danger}
            style={styles.logoutIcon}
          />
          <Text style={[styles.logoutButtonText, { color: colors.danger }]}>
            {t('profile.logout')}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  },
  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
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

  identityBlock: { alignItems: 'center', paddingHorizontal: 24, marginTop: 14 },
  userName: { fontSize: 20, fontWeight: '800' },
  userEmail: { fontSize: 13, marginTop: 3 },
  cityRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  cityText: { fontSize: 13, fontWeight: '500' },

  bioBlock: {
    marginHorizontal: 16,
    marginTop: 18,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  bioText: { fontSize: 13, lineHeight: 19 },
  bioEmptyText: { fontSize: 13, fontWeight: '600', lineHeight: 19 },

  sportsBlock: { marginTop: 18, paddingHorizontal: 16 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
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
  emptyHintText: { fontSize: 12, fontWeight: '600' },

  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsNumber: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  statsLabel: { fontSize: 10, fontWeight: '500', marginTop: 2 },

  menuContainer: {
    marginHorizontal: 16,
    borderWidth: 1,
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
  },
  noBorder: { borderBottomWidth: 0 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { marginRight: 12 },
  menuItemText: { fontSize: 14, fontWeight: '600' },
  menuItemRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  moderationDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },

  logoutButton: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutIcon: { marginRight: 8 },
  logoutButtonText: { fontSize: 15, fontWeight: '700' },
});