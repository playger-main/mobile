// src/app/user/joined.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';

import EventListCard from '@/components/ui/EventListCard';
import {
  $myJoinedEvents,
  $isMyJoinedLoading,
  $userSession,
  fetchMyJoinedEventsFx,
} from '@/effector/store';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

export default function JoinedEventsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const events = useUnit($myJoinedEvents);
  const isLoading = useUnit($isMyJoinedLoading);
  const user = useUnit($userSession);
  const fetchJoined = useUnit(fetchMyJoinedEventsFx);

  useEffect(() => {
    fetchJoined();
  }, []);

  const countKey =
    events.length === 1 ? 'joined.count_one' : 'joined.count_other';

  return (
    <View
      style={[styles.container, { backgroundColor: colors.listBackground }]}
    >
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
          <Ionicons name="chevron-back" size={24} color={colors.primaryDark} />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {t('joined.title')}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
            {t(countKey, { count: events.length })}
          </Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      {isLoading && events.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventListCard
              item={item}
              showDate
              showCreatorBadge
              currentUserId={user?.id}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBlock}>
              <Ionicons
                name="calendar-outline"
                size={48}
                color={colors.textTertiary}
              />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                {t('joined.empty')}
              </Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('joined.emptyHint')}
              </Text>
              <Pressable
                style={[
                  styles.emptyButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() => router.push('/(drawer)/(tabs)/events')}
              >
                <Text style={styles.emptyButtonText}>
                  {t('joined.findButton')}
                </Text>
              </Pressable>
            </View>
          }
        />
      )}
    </View>
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
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: 16 },
  emptyBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginTop: 12 },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  emptyButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});