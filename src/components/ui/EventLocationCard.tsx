// src/components/ui/EventLocationCard.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EventLocationCardProps {
  name: string;
  address: string;
  avatar?: string | null;
  onPress: () => void;
}

export default function EventLocationCard({
  name,
  address,
  avatar,
  onPress,
}: EventLocationCardProps) {
  const [imageError, setImageError] = useState(false);

  const showImage = !!avatar && !imageError;

  return (
    <Pressable style={styles.locationCard} onPress={onPress}>
      {/* Обложка площадки или плейсхолдер */}
      <View style={styles.locationImageContainer}>
        {showImage ? (
          <Image
            source={{ uri: avatar! }}
            style={styles.locationImage}
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.locationImagePlaceholder}>
            <Ionicons name="image-outline" size={20} color="#BACAD6" />
          </View>
        )}
      </View>

      <View style={styles.locationInfo}>
        <Text style={styles.locationSubtitle}>Location</Text>
        <Text style={styles.locationName} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.locationAddress} numberOfLines={1}>
          {address}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="#6080A8"
        style={styles.locationArrow}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  locationImageContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F0F4F8',
  },
  locationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  locationImagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: { flex: 1, marginLeft: 12, marginRight: 8 },
  locationSubtitle: {
    fontSize: 11,
    color: '#BACAD6',
    fontWeight: '500',
  },
  locationName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334A77',
    marginTop: 1,
  },
  locationAddress: {
    fontSize: 12,
    color: '#6080A8',
    marginTop: 1,
  },
  locationArrow: { marginLeft: 'auto' },
});
  