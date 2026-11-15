// src/app/(drawer)/privacy.tsx
import React from 'react';
import { useRouter } from 'expo-router';

import LegalDocument from '@/components/legal/LegalDocument';
import { PRIVACY_SECTIONS } from '@/content/legal';
import { useTranslation } from '@/i18n';
import { getLegalOverrides } from '@/content/legal-overrides';

export default function PrivacyScreen() {
  const { t, lang } = useTranslation();
  const router = useRouter();

  // ✅ при открытии по прямой ссылке истории может не быть
  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)/settings');
  };

  return (
    <LegalDocument
      title={t('legal.privacy.title')}
      sections={PRIVACY_SECTIONS}
      overrides={getLegalOverrides('privacy', lang)}
      onBack={handleBack}
    />
  );
}
