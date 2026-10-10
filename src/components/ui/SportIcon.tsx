// src/components/ui/SportIcon.tsx
import React from 'react';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { getSportIcon } from '@/constants/sports';

interface SportIconProps {
  id: string;
  size?: number;
  color?: string;
}

export default function SportIcon({ id, size = 24, color }: SportIconProps) {
  const iconName = getSportIcon(id);
  return (
    <MaterialDesignIcons
      name={iconName as any}
      size={size}
      color={color}
    />
  );
}