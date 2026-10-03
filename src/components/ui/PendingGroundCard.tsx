// src/components/ui/PendingGroundCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getBadgeStyle } from '@/constants/badgeStyle';
import { getSportKey } from '@/constants/sports';
import { ExtendedGroundItem } from './CardGround';
import { useTranslation } from '@/i18n';

interface PendingGroundCardProps {
  item: ExtendedGroundItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onPress: () => void;
  isProcessing?: boolean;
}

export default function PendingGroundCard({
  item,
  onApprove,
  onReject,
  onPress,
  isProcessing = false,
}: PendingGroundCardProps) {
  const { t } = useTranslation();

  const sportsList: string[] =
    Array.isArray(item.kindofsport) && item.kindofsport.length > 0
      ? item.kindofsport
      : [];

  return (
    <View style={styles.card}>
      <Pressable style={styles.topSection} onPress={onPress}>
        <Image
          source={{ uri: item.avatar || 'https://unsplash.com' }}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.address} numberOfLines={1}>
            {item.address || t('grounds.noAddress')}
          </Text>

          {sportsList.length > 0 && (
            <View style={styles.sportsRow}>
              {sportsList.slice(0, 2).map((sportId, idx) => {
                const style = getBadgeStyle(sportId);
                const label = t(getSportKey(sportId));
                return (
                  <View
                    key={`${sportId}-${idx}`}
                    style={[styles.categoryBadge, { backgroundColor: style.bg }]}
                  >
                    <View
                      style={[styles.categoryDot, { backgroundColor: style.text }]}
                    />
                    <Text style={[styles.categoryText, { color: style.text }]}>
                      {label.toUpperCase()}
                    </Text>
                  </View>
                );
              })}
              {sportsList.length > 2 && (
                <View style={styles.moreBadge}>
                  <Text style={styles.moreBadgeText}>
                    +{sportsList.length - 2}
                  </Text>
                </View>
              )}
            </View>
          )}

          {item.creator?.name && (
            <Text style={styles.creatorText}>
              {t('pendingGround.byCreator', { name: item.creator.name })}
            </Text>
          )}
        </View>
      </Pressable>

      <View style={styles.actions}>
        <Pressable
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => onReject(item.id)}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FF3B30" />
          ) : (
            <>
              <Ionicons name="close-circle-outline" size={18} color="#FF3B30" />
              <Text style={styles.rejectText}>{t('moderation.reject')}</Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.approveButton]}
          onPress={() => onApprove(item.id)}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
              <Text style={styles.approveText}>{t('moderation.approve')}</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FFE0B2',
    overflow: 'hidden',
    shadowColor: '#334A77',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  topSection: { flexDirection: 'row', padding: 12 },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F0F4F8',
  },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '700', color: '#334A77' },
  address: { fontSize: 12, color: '#6080A8', marginTop: 2 },
  sportsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryDot: { width: 5, height: 5, borderRadius: 2.5, marginRight: 4 },
  categoryText: { fontSize: 9, fontWeight: '700' },
  moreBadge: {
    backgroundColor: '#F0F6FC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  moreBadgeText: { fontSize: 9, fontWeight: '700', color: '#6080A8' },
  creatorText: {
    fontSize: 11,
    color: '#BACAD6',
    fontWeight: '500',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F6FC',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
  },
  rejectButton: {
    backgroundColor: '#FFF5F5',
    borderRightWidth: 1,
    borderRightColor: '#F0F6FC',
  },
  approveButton: { backgroundColor: '#208AEF' },
  rejectText: { color: '#FF3B30', fontSize: 13, fontWeight: '700' },
  approveText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});