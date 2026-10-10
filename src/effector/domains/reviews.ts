// src/effector/domains/reviews.ts
import { createDomain, sample } from 'effector';
import {
  fetchGroundReviewsFx,
  fetchMyReviewFx,
  fetchMyReviewsFx,
  createReviewFx,
  updateReviewFx,
  deleteReviewFx,
  toggleReviewLikeFx,
  GroundReview,
  ReviewStats,
  MyReview,
} from '../events/async/reviews';

const reviewsDomain = createDomain('reviews');

// ✅ №3: оптимистичный тоггл
export const reviewLikeToggled = reviewsDomain.createEvent<{
  reviewId: string;
}>();

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
  )
  // ✅ Оптимистично при клике
  .on(reviewLikeToggled, (state, { reviewId }) =>
    state.map((r) =>
      r.id === reviewId
        ? {
            ...r,
            likedByMe: !r.likedByMe,
            likesCount: r.likedByMe ? r.likesCount - 1 : r.likesCount + 1,
          }
        : r,
    ),
  )
  // ✅ Синхронизация с сервером
  .on(toggleReviewLikeFx.doneData, (state, result) =>
    state.map((r) =>
      r.id === result.reviewId
        ? { ...r, likedByMe: result.liked, likesCount: result.likesCount }
        : r,
    ),
  )
  // ✅ Откат при ошибке
  .on(toggleReviewLikeFx.fail, (state, { params: reviewId }) =>
    state.map((r) =>
      r.id === reviewId
        ? {
            ...r,
            likedByMe: !r.likedByMe,
            likesCount: r.likedByMe ? r.likesCount - 1 : r.likesCount + 1,
          }
        : r,
    ),
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
// МОИ ОТЗЫВЫ
// ==========================================

export const $myReviews = reviewsDomain
  .createStore<MyReview[]>([])
  .on(fetchMyReviewsFx.doneData, (_, payload) => payload)
  .on(fetchMyReviewsFx.failData, () => [])
  .on(createReviewFx.doneData, (state, review) => [
    { ...review, ground: null } as MyReview,
    ...state,
  ])
  .on(updateReviewFx.doneData, (state, updated) =>
    state.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)),
  )
  .on(deleteReviewFx.done, (state, { params: reviewId }) =>
    state.filter((r) => r.id !== reviewId),
  );

export const $myReviewsCount = $myReviews.map((list) => list.length);

export const $isMyReviewsLoading = reviewsDomain
  .createStore(false)
  .on(fetchMyReviewsFx, () => true)
  .on(fetchMyReviewsFx.finally, () => false);

// ==========================================
// ✅ №3: связка клик → эффект
// ==========================================

sample({
  clock: reviewLikeToggled,
  fn: ({ reviewId }) => reviewId,
  target: toggleReviewLikeFx,
});
