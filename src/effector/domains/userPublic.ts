// src/effector/domains/userPublic.ts
import { createDomain } from 'effector';
import {
  fetchPublicUserFx,
  PublicUserProfile,
} from '../events/async/userPublic';

const userPublicDomain = createDomain('userPublic');

export const $viewedUser = userPublicDomain
  .createStore<PublicUserProfile | null>(null)
  .on(fetchPublicUserFx.doneData, (_, payload) => payload)
  .on(fetchPublicUserFx.failData, () => null);

export const $isViewedUserLoading = userPublicDomain
  .createStore(false)
  .on(fetchPublicUserFx, () => true)
  .on(fetchPublicUserFx.finally, () => false);