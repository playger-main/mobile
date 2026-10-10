// src/components/ui/SurfaceIcon.tsx
import React from 'react';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { getSurfaceIcon } from '@/constants/surface';

interface SurfaceIconProps {
  id: string;
  size?: number;
  color?: string;
}

export default function SurfaceIcon({ id, size = 24, color }: SurfaceIconProps) {
  const iconName = getSurfaceIcon(id);
  return (
    <MaterialDesignIcons
      name={iconName as any}
      size={size}
      color={color}
    />
  );
}