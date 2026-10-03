// src/effector/domains/reviews.ts
import { createDomain } from 'effector';
import {
  fetchGroundReviewsFx,
  fetchMyReviewFx,
  fetchMyReviewsFx,
  createReviewFx,
  updateReviewFx,
  deleteReviewFx,
  GroundReview,
  ReviewStats,
  MyReview,
} from '../events/async/reviews';

const reviewsDomain = createDomain('reviews');

// ==========================================
// СПИСОК ОТЗЫВОВ ПЛОЩАДКИ
// ==========================================

export const $groundReviews = reviewsDomain
  .createStore<GroundReview[]>([])
  .on(fetchGroundReviewsFx.doneData, (_, payload) => payload.reviews)
  .on(fetchGroundReviewsFx.failData, () => [])
  .on(createReviewFx.doneData, (state, review) => [review, ...state])
  .on(updateReviewFx.doneData, (state, updated) =>
    state.map((r) => (r.id === updated.id ? updated : r)),
  )
  .on(deleteReviewFx.done, (state, { params: reviewId }) =>
    state.filter((r) => r.id !== reviewId),
  );

export const $groundReviewStats = reviewsDomain
  .createStore<ReviewStats>({
    avgRating: 0,
    totalReviews: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  })
  .on(fetchGroundReviewsFx.doneData, (_, payload) => payload.stats)
  .on(fetchGroundReviewsFx.failData, () => ({
    avgRating: 0,
    totalReviews: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  }));

export const $isReviewsLoading = reviewsDomain
  .createStore(false)
  .on(fetchGroundReviewsFx, () => true)
  .on(fetchGroundReviewsFx.finally, () => false);

// ==========================================
// МОЙ ОТЗЫВ НА КОНКРЕТНУЮ ПЛОЩАДКУ
// ==========================================

export const $myReview = reviewsDomain
  .createStore<GroundReview | null>(null)
  .on(fetchMyReviewFx.doneData, (_, payload) => payload)
  .on(fetchMyReviewFx.failData, () => null)
  .on(createReviewFx.doneData, (_, review) => review)
  .on(updateReviewFx.doneData, (_, review) => review)
  .on(deleteReviewFx.done, () => null);

export const $canCreateReview = $myReview.map((r) => r === null);
export const $hasMyReview = $myReview.map((r) => r !== null);

// ==========================================
// МОИ ОТЗЫВЫ (для экрана "My reviews")
// ==========================================

export const $myReviews = reviewsDomain
  .createStore<MyReview[]>([])
  .on(fetchMyReviewsFx.doneData, (_, payload) => payload)
  .on(fetchMyReviewsFx.failData, () => [])
  // Создали — добавляем в топ (без ground-объекта, но бэк вернёт при следующем fetch)
  .on(createReviewFx.doneData, (state, review) => [
    { ...review, ground: null } as MyReview,
    ...state,
  ])
  // Обновили — заменяем
  .on(updateReviewFx.doneData, (state, updated) =>
    state.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)),
  )
  // Удалили — убираем
  .on(deleteReviewFx.done, (state, { params: reviewId }) =>
    state.filter((r) => r.id !== reviewId),
  );

export const $myReviewsCount = $myReviews.map((list) => list.length);

export const $isMyReviewsLoading = reviewsDomain
  .createStore(false)
  .on(fetchMyReviewsFx, () => true)
  .on(fetchMyReviewsFx.finally, () => false);