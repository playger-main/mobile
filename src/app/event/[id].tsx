  // src/app/event/[id].tsx
import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';

import {
  fetchEventByIdFx,
  toggleJoinEventFx,
} from '@/effector/events/async/events';
import {
  $currentEvent,
  $isEventDetailLoading,
  $userSession,
} from '@/effector/store';

import EventGridInfo from '@/components/ui/EventGridInfo';
import EventProgressBar from '@/components/ui/EventProgressBar';
import EventLocationCard from '@/components/ui/EventLocationCard';
import ParticipantsModal from '@/components/ui/ParticipantsModal';
import { getBadgeStyle } from '@/constants/badgeStyle';
import { getSportKey } from '@/constants/sports';

import {
  getEventStatus,
  getEventStatusLabelKey,
  getEventStatusStyle,
} from '@/utils/eventStatus';

import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { theme, colors } = useTheme();

  const { event, isLoading, userSession, toggleJoin, isJoining } = useUnit({
    event: $currentEvent,
    isLoading: $isEventDetailLoading,
    userSession: $userSession,
    toggleJoin: toggleJoinEventFx,
    isJoining: toggleJoinEventFx.pending,
  });

  const [participantsVisible, setParticipantsVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        fetchEventByIdFx(id);
      }
    }, [id]),
  );

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)/(tabs)/events');
  };

  // ✅ №9: редирект гостя на профиль при попытке открыть участников
  const handleOpenParticipants = useCallback(() => {
    if (!userSession) {
      Alert.alert(
        t('event.detail.authRequired'),
        t('event.detail.authHint'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('common.signIn'),
            onPress: () => router.push('/(drawer)/(tabs)/profile'),
          },
        ],
      );
      return;
    }
    setParticipantsVisible(true);
  }, [userSession, router, t]);

  const handleJoinToggleAction = async () => {
    if (!userSession) {
      Alert.alert(
        t('event.detail.authRequired'),
        t('event.detail.authHint'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('common.signIn'),
            onPress: () => router.push('/(drawer)/(tabs)/profile'),
          },
        ],
      );
      return;
    }

    try {
      await toggleJoin(event!.id);
    } catch (err: any) {
      const raw = err?.response?.data?.message ?? err?.message;
      const message = Array.isArray(raw)
        ? raw.join('\n')
        : typeof raw === 'string'
          ? raw
          : t('common.tryAgain');
      Alert.alert(t('event.detail.actionFailed'), message);
    }
  };

  if (isLoading || !event) {
    return (
      <View
        style={[styles.loaderContainer, { backgroundColor: colors.listBackground }]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const maxPlayers = event.maxPlayers || 14;
  const currentPlayers = event.currentPlayers || 0;

  const sportsList: string[] =
    Array.isArray(event.ground?.kindofsport) &&
    event.ground.kindofsport.length > 0
      ? event.ground.kindofsport
      : [];

  const status = getEventStatus(event.date, event.startTime, event.duration);
  const statusStyle = getEventStatusStyle(status, theme); // ✅ theme
  const statusLabel = t(getEventStatusLabelKey(status));
  const isFinished = status === 'finished';

  const isJoined = Array.isArray(event.players)
    ? event.players.some((p) => p.id === userSession?.id)
    : false;

  const isFull = currentPlayers >= maxPlayers;

  const isCreator = userSession?.id === event.creator?.id;
  const isModerator =
    userSession?.role?.includes('moderator') ||
    userSession?.role?.includes('admin');
  const canEdit = isCreator || isModerator;

  const playersList = Array.isArray(event.players) ? [...event.players] : [];

  let buttonText = t('event.detail.join');
  let buttonStyle: any[] = [
    styles.joinButton,
    { backgroundColor: colors.primaryDark },
  ];
  let buttonTextColor: string | undefined = '#FFFFFF';
  let buttonDisabled = false;

  if (isFinished) {
    buttonText = t('event.detail.finished');
    buttonStyle = [
      styles.joinButton,
      { backgroundColor: colors.disabledBg },
    ];
    buttonTextColor = colors.textTertiary;
    buttonDisabled = true;
  } else if (isJoined) {
    buttonText = t('event.detail.leave');
    buttonStyle = [
      styles.joinButton,
      {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.danger,
      },
    ];
    buttonTextColor = colors.danger;
  } else if (isFull) {
    buttonText = t('event.detail.full');
    buttonStyle = [
      styles.joinButton,
      { backgroundColor: colors.disabledBg },
    ];
    buttonTextColor = colors.textTertiary;
    buttonDisabled = true;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.listBackground }]}>
      <View
        style={[
          styles.customHeader,
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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {t('event.detail.header')}
        </Text>
        {canEdit ? (
          <Pressable
            onPress={() => router.push(`/event/edit?id=${event.id}`)}
            style={styles.editButton}
            hitSlop={12}
          >
            <Ionicons
              name="create-outline"
              size={22}
              color={colors.primary}
            />
          </Pressable>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.badgesRow}>
          {sportsList.length > 0 ? (
            sportsList.slice(0, 4).map((sportId, idx) => {
              const style = getBadgeStyle(sportId, theme);
              const label = t(getSportKey(sportId));
              return (
                <View
                  key={`${sportId}-${idx}`}
                  style={[styles.sportBadge, { backgroundColor: style.bg }]}
                >
                  <Text style={[styles.sportText, { color: style.text }]}>
                    {label.toUpperCase()}
                  </Text>
                </View>
              );
            })
          ) : (
            <View
              style={[
                styles.sportBadge,
                { backgroundColor: colors.surfaceSecondary },
              ]}
            >
              <Text style={[styles.sportText, { color: colors.textSecondary }]}>
                {t('sport.all').toUpperCase()}
              </Text>
            </View>
          )}

          {sportsList.length > 4 && (
            <View
              style={[
                styles.moreBadge,
                { backgroundColor: colors.surfaceSecondary },
              ]}
            >
              <Text
                style={[styles.moreBadgeText, { color: colors.textSecondary }]}
              >
                +{sportsList.length - 4}
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {event.name}
        </Text>

        {event.creator && (
          <Pressable
            style={[
              styles.hostCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => {
              // ✅ №9: при попытке открыть чужой профиль гостем → на /profile
              if (!userSession) {
                router.push('/(drawer)/(tabs)/profile');
                return;
              }
              router.push({
                pathname: '/user/[id]',
                params: {
                  id: event.creator.id,
                  name: event.creator.name,
                  avatar: event.creator.avatar ?? '',
                },
              });
            }}
          >
            {event.creator.avatar ? (
              <Image
                key={event.creator.avatar}
                source={{ uri: event.creator.avatar }}
                style={[
                  styles.hostAvatarImage,
                  { backgroundColor: colors.surfaceSecondary },
                ]}
              />
            ) : (
              <View
                style={[
                  styles.hostAvatar,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.hostAvatarText}>
                  {event.creator.name?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            )}

            <View style={{ flex: 1 }}>
              <Text
                style={[styles.hostLabel, { color: colors.textTertiary }]}
              >
                {t('event.detail.hostedBy')}
              </Text>
              <Text
                style={[styles.hostName, { color: colors.textPrimary }]}
                numberOfLines={1}
              >
                {event.creator.name || 'User'}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textTertiary}
            />
          </Pressable>
        )}

        <EventGridInfo
          date={event.date}
          startTime={event.startTime}
          duration={event.duration || '60m'}
          level={event.level || 'all'}
          currentPlayers={currentPlayers}
          maxPlayers={maxPlayers}
          status={status}
          onPlayersPress={handleOpenParticipants} // ✅ №9
        />

        <EventProgressBar
          currentPlayers={currentPlayers}
          maxPlayers={maxPlayers}
        />

        <EventLocationCard
          name={event.ground?.name || t('common.ground')}
          address={event.ground?.address || t('grounds.noAddress')}
          avatar={event.ground?.avatar ?? null}
          latitude={event.ground?.geolocation?.lat}
          longitude={event.ground?.geolocation?.lng}
        />

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {t('event.detail.details')}
        </Text>
        <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
          {event.description || t('event.detail.noDetails')}
        </Text>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: insets.bottom + 12,
            backgroundColor: colors.background,
            borderColor: colors.borderSubtle,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <Pressable
          style={[buttonStyle, isJoining && { backgroundColor: colors.disabledBg }]}
          onPress={handleJoinToggleAction}
          disabled={isJoining || buttonDisabled}
        >
          {isJoining ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text
              style={[
                styles.joinButtonText,
                { color: buttonTextColor },
              ]}
            >
              {buttonText}
            </Text>
          )}
        </Pressable>
      </View>

      <ParticipantsModal
        visible={participantsVisible}
        players={playersList}
        creatorId={event.creator?.id}
        maxPlayers={maxPlayers}
        onClose={() => setParticipantsVisible(false)}
        onPlayerPress={(player) => {
          setParticipantsVisible(false);
          if (!userSession) {
            router.push('/(drawer)/(tabs)/profile');
            return;
          }
          router.push({
            pathname: '/user/[id]',
            params: {
              id: player.id,
              name: player.name,
              avatar: player.avatar ?? '',
            },
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  editButton: { padding: 4 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sportText: { fontSize: 11, fontWeight: '700' },
  moreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  moreBadgeText: { fontSize: 11, fontWeight: '700' },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
  },
  hostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  hostAvatarText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  hostLabel: { fontSize: 11, fontWeight: '500' },
  hostName: { fontSize: 14, fontWeight: '700', marginTop: 1 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  descriptionText: { fontSize: 14, lineHeight: 20 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: -2 },
      },
      android: { elevation: 8 },
      web: { boxShadow: '0px -2px 6px rgba(0, 0, 0, 0.15)' },
    }),
  },
  joinButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonText: { fontSize: 15, fontWeight: '700' },
});