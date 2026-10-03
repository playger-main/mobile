// src/effector/events/async/reviews.ts
import { createEffect } from 'effector';
import { apiInstance } from '../../api';

// ==========================================
// ТИПЫ
// ==========================================

export interface ReviewAuthor {
  id: string;
  name: string;
  avatar: string | null;
}

export interface GroundReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: number;
  updatedAt: number;
  author: ReviewAuthor | null;
  groundId: string | null;
}

export interface ReviewStats {
  avgRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
}

export interface GetGroundReviewsResult {
  reviews: GroundReview[];
  stats: ReviewStats;
}

export interface CreateReviewPayload {
  groundId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  reviewId: string;
  rating?: number;
  comment?: string;
}

// ✅ Расширение для экрана "My reviews" — с данными площадки
export interface MyReview extends GroundReview {
  ground: {
    id: string;
    name: string;
    address: string | null;
    avatar: string | null;
  } | null;
}

// ==========================================
// API
// ==========================================

const reviewApi = {
  getByGround: async (groundId: string): Promise<GetGroundReviewsResult> => {
    const res = await apiInstance.get<GetGroundReviewsResult>(
      `/review/ground/${groundId}`,
    );
    return res.data;
  },

  getMyReview: async (groundId: string): Promise<GroundReview | null> => {
    const res = await apiInstance.get<GroundReview | null>(
      `/review/ground/${groundId}/me`,
    );
    return res.data;
  },

  getMine: async (): Promise<MyReview[]> => {
    try {        
        const res = await apiInstance.get<MyReview[]>('/review/mine');        
        return res.data;
    } catch (e: any) {
        console.error(
        '[reviews] /review/mine FAILED:',
        e?.response?.status,
        e?.response?.data ?? e?.message,
        );
        throw e;
    }
    },

  create: async (payload: CreateReviewPayload): Promise<GroundReview> => {
    const { groundId, ...body } = payload;
    const res = await apiInstance.post<GroundReview>(
      `/review/ground/${groundId}`,
      body,
    );
    return res.data;
  },

  update: async (payload: UpdateReviewPayload): Promise<GroundReview> => {
    const { reviewId, ...body } = payload;
    const res = await apiInstance.put<GroundReview>(
      `/review/${reviewId}`,
      body,
    );
    return res.data;
  },

  remove: async (reviewId: string): Promise<void> => {
    await apiInstance.delete(`/review/${reviewId}`);
  },
};

// ==========================================
// ЭФФЕКТЫ
// ==========================================

export const fetchGroundReviewsFx = createEffect(reviewApi.getByGround);
export const fetchMyReviewFx = createEffect(reviewApi.getMyReview);
export const fetchMyReviewsFx = createEffect(reviewApi.getMine);
export const createReviewFx = createEffect(reviewApi.create);
export const updateReviewFx = createEffect(reviewApi.update);
export const deleteReviewFx = createEffect(reviewApi.remove);