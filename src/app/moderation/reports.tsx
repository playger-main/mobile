// src/app/moderation/reports.tsx
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useUnit } from 'effector-react';
import Ionicons from '@react-native-vector-icons/ionicons';

import ScreenHeader from '@/components/forms/ScreenHeader';
import {
  $moderationReports,
  $moderationReportsLoading,
  deleteReportedContentFx,
  fetchReportsFx,
  resolveReportFx,
} from '@/effector/store';
import type { ModerationReport } from '@/effector/store';
import { useTranslation, useRelativeDate } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

type Filter = 'pending' | 'actioned' | 'rejected';

const FILTERS: Filter[] = ['pending', 'actioned', 'rejected'];

const TARGET_ICON: Record<string, string> = {
  review: 'chatbubble-ellipses-outline',
  ground: 'location-outline',
  event: 'calendar-outline',
  photo: 'image-outline',
  user: 'person-outline',
};

export default function ModerationReportsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const formatRelativeDate = useRelativeDate();

  const reports = useUnit($moderationReports);
  const isLoading = useUnit($moderationReportsLoading);
  const fetchReports = useUnit(fetchReportsFx);
  const resolveReport = useUnit(resolveReportFx);
  const deleteContent = useUnit(deleteReportedContentFx);

  const [filter, setFilter] = useState<Filter>('pending');

  const load = useCallback(
    (value: Filter) => {
      fetchReports({ status: value });
    },
    [fetchReports],
  );

  useFocusEffect(
    useCallback(() => {
      load(filter);
    }, [load, filter]),
  );

  const handleResolve = (report: ModerationReport, status: 'actioned' | 'rejected') => {
    resolveReport({ id: report.id, status });
    if (status === 'actioned' && filter === 'pending') {
      load(filter);
    }
  };

  const handleDeleteContent = (report: ModerationReport) => {
    Alert.alert(
      t('moderation.reports.deleteTitle'),
      t('moderation.reports.deleteHint'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            deleteContent({
              targetType: report.targetType,
              targetId: report.targetId,
            });
            handleResolve(report, 'actioned');
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: ModerationReport }) => (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.cardTop}>
        <View style={styles.typeRow}>
          <Ionicons
            name={(TARGET_ICON[item.targetType] ?? 'flag-outline') as any}
            size={15}
            color={colors.textSecondary}
          />
          <Text style={[styles.typeText, { color: colors.textSecondary }]}>
            {t(`moderation.reports.target.${item.targetType}`)}
          </Text>
        </View>
        <Text style={[styles.dateText, { color: colors.textTertiary }]}>
          {formatRelativeDate(new Date(item.createdAt).getTime())}
        </Text>
      </View>

      <Text style={[styles.reason, { color: colors.textPrimary }]}>
        {t(`moderation.reports.reason.${item.reason}`)}
      </Text>

      {!!item.comment && (
        <Text style={[styles.comment, { color: colors.textSecondary }]}>
          {item.comment}
        </Text>
      )}

      {!!item.reporter && (
        <Text style={[styles.reporter, { color: colors.textTertiary }]}>
          {t('moderation.reports.reportedBy')}: {item.reporter.username}
        </Text>
      )}

      {item.status === 'pending' ? (
        <View style={styles.actions}>
          <Pressable
            onPress={() => handleResolve(item, 'rejected')}
            style={[styles.actionBtn, { borderColor: colors.border }]}
            accessibilityRole="button"
            accessibilityLabel={t('moderation.reports.reject')}
          >
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
              {t('moderation.reports.reject')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleDeleteContent(item)}
            style={[
              styles.actionBtn,
              { borderColor: colors.danger, backgroundColor: colors.dangerBg },
            ]}
            accessibilityRole="button"
            accessibilityLabel={t('moderation.reports.deleteContent')}
          >
            <Text style={[styles.actionText, { color: colors.danger }]}>
              {t('moderation.reports.deleteContent')}
            </Text>
          </Pressable>
        </View>
      ) : (
        <Text
          style={[
            styles.statusText,
            { color: item.status === 'actioned' ? colors.accent : colors.textTertiary },
          ]}
        >
          {t(`moderation.reports.status.${item.status}`)}
        </Text>
      )}
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.listBackground }]}>
      <ScreenHeader title={t('moderation.reports.title')} onBack={() => router.back()} />

      <View style={styles.filters}>
        {FILTERS.map((value) => {
          const active = value === filter;
          return (
            <Pressable
              key={value}
              onPress={() => setFilter(value)}
              style={[
                styles.chip,
                {
                  borderColor: active ? colors.primary : colors.border,
                  backgroundColor: active ? colors.primaryBg : colors.surface,
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: active ? colors.primary : colors.textSecondary },
                ]}
              >
                {t(`moderation.reports.filter.${value}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {isLoading && reports.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => load(filter)}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="checkmark-done-outline"
                size={42}
                color={colors.textTertiary}
              />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('moderation.reports.empty')}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  chip: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: { fontSize: 13, fontWeight: '600' },
  listContent: { padding: 16, gap: 12, paddingBottom: 40 },
  card: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  typeText: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  dateText: { fontSize: 11, fontWeight: '500' },
  reason: { fontSize: 15, fontWeight: '700' },
  comment: { fontSize: 13, lineHeight: 19 },
  reporter: { fontSize: 12 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  actionBtn: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: { fontSize: 13, fontWeight: '700' },
  statusText: { fontSize: 12, fontWeight: '700' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 14, fontWeight: '500' },
});
