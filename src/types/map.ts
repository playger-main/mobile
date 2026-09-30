// src/types/map.ts
export type GroundActivityLevel = 'active' | 'upcoming' | 'none';

export interface GroundMapMarker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  activityLevel: GroundActivityLevel;
  sportId: string;         // ✅ id спорта (для иконки)
  address?: string;
  avatar?: string; 
}