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
import { getSportLabel } from '@/constants/sports';
import { ExtendedGroundItem } from './CardGround';

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
  // ✅ id спорта (для цвета) и label (для текста)
  const primarySportId =
    item.kindofsport && item.kindofsport.length > 0 ? item.kindofsport[0] : 'Sport';
  const primarySportLabel = getSportLabel(primarySportId);

  const currentBadgeStyle = getBadgeStyle(primarySportId);

  return (
    <View style={styles.card}>
      {/* Верхняя часть — кликабельная */}
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
            {item.address || 'No address provided'}
          </Text>

          <View style={[styles.categoryBadge, { backgroundColor: currentBadgeStyle.bg }]}>
            <View
              style={[styles.categoryDot, { backgroundColor: currentBadgeStyle.text }]}
            />
            <Text style={[styles.categoryText, { color: currentBadgeStyle.text }]}>
              {primarySportLabel.toUpperCase()}
            </Text>
          </View>

          {item.creator?.name && (
            <Text style={styles.creatorText}>by {item.creator.name}</Text>
          )}
        </View>
      </Pressable>

      {/* Нижняя часть — кнопки действий */}
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
              <Text style={styles.rejectText}>Reject</Text>
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
              <Text style={styles.approveText}>Approve</Text>
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
  topSection: {
    flexDirection: 'row',
    padding: 12,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F0F4F8',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334A77',
  },
  address: {
    fontSize: 12,
    color: '#6080A8',
    marginTop: 2,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
  },
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
  approveButton: {
    backgroundColor: '#208AEF',
  },
  rejectText: {
    color: '#FF3B30',
    fontSize: 13,
    fontWeight: '700',
  },
  approveText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
