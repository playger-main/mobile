// src/app/(drawer)/terms.tsx
import React from 'react';
import { useRouter } from 'expo-router';

import LegalDocument from '@/components/legal/LegalDocument';
import { TERMS_SECTIONS } from '@/content/legal';
import { useTranslation } from '@/i18n';
import { getLegalOverrides } from '@/content/legal-overrides';

export default function TermsScreen() {
  const { t, lang } = useTranslation();
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)/settings');
  };

  return (
    <LegalDocument
      title={t('legal.terms.title')}
      sections={TERMS_SECTIONS}
      overrides={getLegalOverrides('terms', lang)}
      onBack={handleBack}
    />
  );
}
