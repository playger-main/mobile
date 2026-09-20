// src/components/ui/EventLocationCard.tsx
import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EventLocationCardProps {
  name: string;
  address: string;
  onPress: () => void;
}

export default function EventLocationCard({ name, address, onPress }: EventLocationCardProps) {
  return (
    <Pressable style={styles.locationCard} onPress={onPress}>
      <View style={styles.locationImagePlaceholder}>
        <Ionicons name="image" size={20} color="#BACAD6" />
      </View>
      <View style={styles.locationInfo}>
        <Text style={styles.locationSubtitle}>Location</Text>
        <Text style={styles.locationName} numberOfLines={1}>{name}</Text>
        <Text style={styles.locationAddress} numberOfLines={1}>{address}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#6080A8" style={styles.locationArrow} />
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
  locationImagePlaceholder: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#F0F4F8', alignItems: 'center', justifyContent: 'center' },
  locationInfo: { flex: 1, marginLeft: 12, marginRight: 8 },
  locationSubtitle: { fontSize: 11, color: '#BACAD6', fontWeight: '500' },
  locationName: { fontSize: 14, fontWeight: '700', color: '#334A77', marginTop: 1 },
  locationAddress: { fontSize: 12, color: '#6080A8', marginTop: 1 },
  locationArrow: { marginLeft: 'auto' },
});
