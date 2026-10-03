// src/components/ui/EventLocationCard.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { navigateToGroundOnMap } from '@/utils/navigateToGround';
import { useTranslation } from '@/i18n';

interface EventLocationCardProps {
  name: string;
  address: string;
  avatar?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  onPress?: () => void;
}

export default function EventLocationCard({
  name,
  address,
  avatar,
  latitude,
  longitude,
  onPress,
}: EventLocationCardProps) {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const showImage = !!avatar && !imageError;

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    navigateToGroundOnMap(latitude, longitude);
  };

  return (
    <Pressable style={styles.locationCard} onPress={handlePress}>
      <View style={styles.locationImageContainer}>
        {showImage ? (
          <Image
            key={avatar!}
            source={{ uri: avatar! }}
            style={styles.locationImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.locationImagePlaceholder}>
            <Ionicons name="image-outline" size={20} color="#BACAD6" />
          </View>
        )}
      </View>

      <View style={styles.locationInfo}>
        <Text style={styles.locationSubtitle}>
          {t('eventLocation.subtitle')}
        </Text>
        <Text style={styles.locationName} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.locationAddress} numberOfLines={1}>
          {address}
        </Text>
      </View>

      <Ionicons
        name="map-outline"
        size={20}
        color="#208AEF"
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