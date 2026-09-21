// src/components/ui/CardGround.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getBadgeStyle } from '@/constants/badgeStyle';

// Полный интерфейс на основе реального ответа NestJS
export interface ExtendedGroundItem {
  id: string;
  name: string;
  kindofsport: string[];
  coverage: string[];
  description: string | null;
  createdAt: string;
  updatedAt: string;
  address: string | null;
  geolocation: {
    lat: string;
    lng: string;
  } | null;
  avatar: string;
  eventsCount: number; // Счетчик событий с бэкенда
  isFavorite: boolean;
  avgRating: number;
  distanceMeters?: number;
}

interface CardGroundProps {
  item: ExtendedGroundItem;
  onPress: () => void;
  onToggleFavorite: (id: string) => void;
}

export default function CardGround({ item, onPress, onToggleFavorite }: CardGroundProps) {
  // Извлекаем основной вид спорта из массива (или "Sport" по умолчанию)
  const primarySport = item.kindofsport && item.kindofsport.length > 0 
    ? item.kindofsport[0] 
    : 'Sport';

  const currentBadgeStyle = getBadgeStyle(primarySport);

  // Форматируем отображение дистанции (переводим метры в км)
  const displayDistance = item.distanceMeters !== undefined
    ? item.distanceMeters > 999 
      ? `${(item.distanceMeters / 1000).toFixed(1)} km` 
      : `${item.distanceMeters} m`
    : 'Nearby';

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Изображение площадки */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.avatar || 'https://unsplash.com' }} 
          style={styles.image} 
        />
        
        {/* ✅ ИСПРАВЛЕНИЕ: Компактный бадж. Только иконка календаря и число! */}
        {item.eventsCount > 0 && (
          <View style={styles.compactEventBadge}>
            <Ionicons name="calendar" size={11} color="#FFFFFF" style={styles.badgeIcon} />
            <Text style={styles.compactEventText}>{item.eventsCount}</Text>
          </View>
        )}
      </View>

      {/* Информация о площадке */}
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
          <Pressable 
            onPress={() => onToggleFavorite(item.id)} 
            style={styles.favoriteButton}
            hitSlop={8}
          >
            <Ionicons
              name={item.isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={item.isFavorite ? '#FF3B30' : '#BACAD6'}
            />
          </Pressable>
        </View>

        <Text style={styles.address} numberOfLines={1}>
          {item.address || 'No address provided'}
        </Text>

        {/* Тег категории спорта с динамическим цветом */}
        <View style={[styles.categoryBadge, { backgroundColor: currentBadgeStyle.bg }]}>
          <View style={[styles.categoryDot, {backgroundColor: currentBadgeStyle.text}]} />
          <Text style={[styles.categoryText, { color: currentBadgeStyle.text }]}>
            {primarySport.toUpperCase()}
          </Text>
        </View>

        {/* Рейтинг и Дистанция */}
        <View style={styles.footerRow}>
          <View style={styles.ratingBlock}>
            <Ionicons name="star" size={14} color="#FFCC00" />
            <Text style={styles.ratingText}>
              {item.avgRating ? item.avgRating.toFixed(1) : '0.0'}{' '}
              <Text style={styles.reviewsText}>({item.eventsCount || 0})</Text>
            </Text>
          </View>
          
          <View style={styles.distanceBlock}>
            <Ionicons name="location-outline" size={14} color="#6080A8" />
            <Text style={styles.distanceText}>{displayDistance}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    shadowColor: '#334A77',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0F4F8',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // ✅ НОВЫЕ АККУРАТНЫЕ СТИЛИ ДЛЯ МИНИ-БАДЖА
  compactEventBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#34C759', // Оставляем ваш сочный зеленый цвет
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6, // Аккуратное скругление плашки
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  badgeIcon: {
    marginRight: 3,
  },
  compactEventText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334A77',
    flex: 1,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 2,
  },
  address: {
    fontSize: 13,
    color: '#6080A8',
    marginTop: -2,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  categoryDot: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: '#FF8000', 
    marginRight: 6 
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334A77',
    marginLeft: 4,
  },
  reviewsText: {
    color: '#BACAD6',
    fontWeight: '400',
  },
  distanceBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 12,
    color: '#6080A8',
    marginLeft: 2,
    fontWeight: '500',
  },
});

