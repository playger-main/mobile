// src/components/ui/ClusterMarker.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ClusterMarkerProps {
  count: number;
}

export default function ClusterMarker({ count }: ClusterMarkerProps) {
  // Размер кластера зависит от количества
  const size = count < 10 ? 40 : count < 100 ? 48 : 56;

  return (
    <View
      style={[
        styles.cluster,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={styles.clusterText}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cluster: {
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  clusterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
