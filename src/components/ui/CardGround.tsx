import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GroundItem } from './MapComponent';

// Расширяем интерфейс GroundItem дополнительными полями из макета
export interface ExtendedGroundItem extends GroundItem {
  imageUrl: string;
  address: string;
  category: string;
  rating: number;
  reviewsCount: number;
  distance: string;
  isLive?: boolean;
}

interface CardGroundProps {
  item: ExtendedGroundItem;
  onPress: () => void;
}

export default function CardGround({ item, onPress }: CardGroundProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Изображение площадки */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        {item.isLive && (
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>

      {/* Информация о площадке */}
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          {/* Кнопка Лайка/Избранного */}
          <Pressable onPress={() => setIsFavorite(!isFavorite)} style={styles.favoriteButton}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? '#FF3B30' : '#6080A8'}
            />
          </Pressable>
        </View>

        <Text style={styles.address} numberOfLines={1}>{item.address}</Text>

        {/* Тег категории спорта */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>

        {/* Рейтинг и Дистанция */}
        <View style={styles.footerRow}>
          <View style={styles.ratingBlock}>
            <Ionicons name="star" size={14} color="#FFCC00" />
            <Text style={styles.ratingText}>
              {item.rating.toFixed(1)}{' '}
              <Text style={styles.reviewsText}>({item.reviewsCount})</Text>
            </Text>
          </View>
          
          <View style={styles.distanceBlock}>
            <Ionicons name="location-outline" size={14} color="#6080A8" />
            <Text style={styles.distanceText}>{item.distance}</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
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
  liveBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#34C759',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
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
    fontSize: 16,
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
    marginTop: 2,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF0E6', // Можно менять цвет в зависимости от спорта
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF8000',
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
    color: '#6080A8',
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
