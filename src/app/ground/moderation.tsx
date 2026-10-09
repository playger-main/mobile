// src/app/ground/moderation.tsx
import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';

import PendingGroundCard from '@/components/ui/PendingGroundCard';
import { ExtendedGroundItem } from '@/components/ui/CardGround';

import {
  fetchGroundsFx,
  confirmGroundFx,
  deleteGroundFx,
} from '@/effector/events/async/grounds';
import {
  $pendingGrounds,
  $isPendingLoading,
  $userSession,
} from '@/effector/store';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

export default function ModerationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const { pendingGrounds, isLoading, user } = useUnit({
    pendingGrounds: $pendingGrounds,
    isLoading: $isPendingLoading,
    user: $userSession,
  });

  const isModerator =
    user?.role?.includes('moderator') || user?.role?.includes('admin');

  useEffect(() => {
    if (isModerator) {
      fetchGroundsFx({ kindofsport: undefined, search: undefined });
    }
  }, [isModerator]);

  if (!isModerator) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, backgroundColor: colors.listBackground },
        ]}
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.background,
              borderColor: colors.borderSubtle,
            },
          ]}
        >
          <Pressable
            onPress={() =>
              router.canGoBack()
                ? router.back()
                : router.replace('/(drawer)/(tabs)')
            }
            style={styles.backButton}
            hitSlop={12}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.primaryDark}
            />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {t('moderation.title')}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.forbiddenContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={48}
            color={colors.textTertiary}
          />
          <Text
            style={[styles.forbiddenTitle, { color: colors.textPrimary }]}
          >
            {t('moderation.accessDenied')}
          </Text>
          <Text
            style={[styles.forbiddenText, { color: colors.textSecondary }]}
          >
            {t('moderation.accessDeniedHint')}
          </Text>
        </View>
      </View>
    );
  }

  const handleApprove = async (id: string) => {
    try {
      await confirmGroundFx({ id, confirmed: true });
      Alert.alert(
        t('moderation.approvedTitle'),
        t('moderation.approvedMessage'),
      );
    } catch (err: any) {
      Alert.alert(
        t('common.error'),
        err?.response?.data?.message || t('moderation.failedApprove'),
      );
    }
  };

  const handleReject = (id: string) => {
    Alert.alert(
      t('moderation.rejectConfirmTitle'),
      t('moderation.rejectConfirmHint'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('moderation.rejectConfirmButton'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGroundFx(id);
              Alert.alert(
                t('moderation.rejectedTitle'),
                t('moderation.rejectedMessage'),
              );
            } catch (err: any) {
              Alert.alert(
                t('common.error'),
                err?.response?.data?.message || t('moderation.failedDelete'),
              );
            }
          },
        },
      ],
    );
  };

  const handleOpenDetail = (item: ExtendedGroundItem) => {
    router.push(`/ground/moderate/${item.id}`);
  };

  const pendingKey =
    pendingGrounds.length === 1
      ? 'moderation.pending_one'
      : 'moderation.pending_other';

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: colors.listBackground },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            // backgroundColor: colors.background,
            borderColor: colors.borderSubtle,
          },
        ]}
      >
        <Pressable
          onPress={() =>
            router.canGoBack()
              ? router.back()
              : router.replace('/(drawer)/(tabs)')
          }
          style={styles.backButton}
          hitSlop={12}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.primaryDark}
          />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {t('moderation.title')}
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textTertiary }]}
          >
            {t(pendingKey, { count: pendingGrounds.length })}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading && pendingGrounds.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={pendingGrounds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PendingGroundCard
              item={item}
              onApprove={handleApprove}
              onReject={handleReject}
              onPress={() => handleOpenDetail(item)}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={48}
                color={colors.accent}
              />
              <Text
                style={[styles.emptyTitle, { color: colors.textPrimary }]}
              >
                {t('moderation.allClear')}
              </Text>
              <Text
                style={[styles.emptyText, { color: colors.textSecondary }]}
              >
                {t('moderation.allClearHint')}
              </Text>
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
  backButton: { padding: 4, width: 32 },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  headerSubtitle: { fontSize: 12, fontWeight: '500', marginTop: 1 },
  headerSpacer: { width: 32 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 16, paddingTop: 16 },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    gap: 8,
    paddingHorizontal: 32,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 8 },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  forbiddenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  forbiddenTitle: { fontSize: 20, fontWeight: '700', marginTop: 8 },
  forbiddenText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});