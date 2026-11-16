// src/components/legal/LegalDocument.tsx
import React from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import Ionicons from '@react-native-vector-icons/ionicons';

import ScreenHeader from '@/components/forms/ScreenHeader';
import { $userSession } from '@/effector/store';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';
import {
  LEGAL_META,
  LegalSection,
  RenderedSection,
  resolveSections,
} from '@/content/legal';

interface LegalDocumentProps {
  /** Заголовок экрана (из i18n) */
  title: string;
  sections: LegalSection[];
  /** Полный перевод документа, если он есть для текущего языка */
  overrides?: RenderedSection[];
  /** Свой обработчик «назад» (например, при открытии по ссылке) */
  onBack?: () => void;
}

/**
 * ✅ Единый экран для юридических документов: мета-блок с версией и датой,
 * нумерованные разделы, списки и контактный блок с рабочим mailto.
 */
export default function LegalDocument({
  title,
  sections,
  overrides,
  onBack,
}: LegalDocumentProps) {
  const { t, lang } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // Переводы есть для en/ru; для остальных языков показываем английский
  // и честно предупреждаем, какая версия юридически значимая.
  const showEnglishNote = lang !== 'en' && lang !== 'ru';

  // ✅ Тексты приводятся к языку здесь: перевод (если есть) → ru → en
  const localizedSections = resolveSections(sections, lang, overrides);

  // ✅ плашка о согласии — только для вошедших пользователей
  const user = useUnit($userSession);
  const consentAt = user?.termsAcceptedAt ? new Date(user.termsAcceptedAt) : null;
  const consentVersion = user?.termsVersion ?? LEGAL_META.version;
  const dateLocale =
    lang === 'ru'
      ? 'ru-RU'
      : lang === 'pl'
        ? 'pl-PL'
        : lang === 'lt'
          ? 'lt-LT'
          : lang === 'uk'
            ? 'uk-UA'
            : lang === 'be'
              ? 'be-BY'
              : 'en-GB';

  const openEmail = () => {
    Linking.openURL(`mailto:${LEGAL_META.contactEmail}`).catch(() => {});
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.listBackground }]}>
      <ScreenHeader title={title} onBack={onBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        {/* Мета: версия и дата вступления в силу */}
        <View
          style={[
            styles.metaCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {t('legal.meta.version', { version: LEGAL_META.version })}
            {'  ·  '}
            {t('legal.meta.effective', { date: LEGAL_META.effectiveDate })}
          </Text>
        </View>

        {showEnglishNote && (
          <Text style={[styles.note, { color: colors.textTertiary }]}>
            {t('legal.englishPrevails')}
          </Text>
        )}

        {localizedSections.map((section, index) => (
          <View key={`${index}`} style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: colors.textPrimary }]}
            >
              {section.title}
            </Text>

            {section.lead && (
              <Text
                style={[styles.paragraph, { color: colors.textSecondary }]}
              >
                {section.lead}
              </Text>
            )}

            {section.bullets?.map((bullet, i) => (
              <View key={`b-${i}`} style={styles.bulletRow}>
                <Text style={[styles.bulletDot, { color: colors.primary }]}>
                  •
                </Text>
                <Text
                  style={[styles.bulletText, { color: colors.textSecondary }]}
                >
                  {bullet}
                </Text>
              </View>
            ))}

            {section.paragraphs?.map((paragraph, i) => (
              <Text
                key={`p-${i}`}
                style={[styles.paragraph, { color: colors.textSecondary }]}
              >
                {paragraph}
              </Text>
            ))}

          </View>
        ))}

        {/* Контакт */}
        <View
          style={[
            styles.contactCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.contactTitle, { color: colors.textPrimary }]}>
            {t('legal.contact.title')}
          </Text>
          <Pressable
            onPress={openEmail}
            accessibilityRole="link"
            accessibilityLabel={LEGAL_META.contactEmail}
            hitSlop={8}
          >
            <Text style={[styles.contactEmail, { color: colors.primary }]}>
              {LEGAL_META.contactEmail}
            </Text>
          </Pressable>
        </View>

        {consentAt && (
          <View
            style={[
              styles.consentCard,
              { backgroundColor: colors.accentBg, borderColor: colors.accent },
            ]}
          >
            <View style={styles.consentHeader}>
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={colors.accent}
              />
              <Text style={[styles.consentTitle, { color: colors.accent }]}>
                {t('legal.consent.title')}
              </Text>
            </View>
            <Text
              style={[styles.consentBody, { color: colors.textSecondary }]}
            >
              {t('legal.consent.body')}
            </Text>
            <Text style={[styles.consentMeta, { color: colors.textTertiary }]}>
              {t('legal.consent.meta', {
                version: consentVersion,
                date: consentAt.toLocaleDateString(dateLocale),
              })}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  metaCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  metaText: { fontSize: 12, fontWeight: '600' },
  note: { fontSize: 12, lineHeight: 18, marginTop: 10 },
  section: { marginTop: 22 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  paragraph: { fontSize: 14, lineHeight: 22, marginBottom: 8 },
  bulletRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  bulletDot: { fontSize: 14, lineHeight: 22, fontWeight: '700' },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 22 },
  contactCard: {
    marginTop: 28,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 6,
  },
  contactTitle: { fontSize: 14, fontWeight: '700' },
  consentCard: {
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  consentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  consentTitle: { fontSize: 14, fontWeight: '700' },
  consentBody: { fontSize: 13, lineHeight: 19 },
  consentMeta: { fontSize: 12 },
  contactEmail: { fontSize: 14, fontWeight: '600' },
});
