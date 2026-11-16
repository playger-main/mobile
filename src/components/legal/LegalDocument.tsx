// src/components/legal/LegalDocument.tsx
import React, { useEffect, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { $userSession } from '@/effector/store';
import {
  getLegalOverrides,
  hasLegalTranslation,
  LEGAL_LANGUAGES,
  LEGAL_LANGUAGE_LABELS,
  normalizeLegalLanguage,
} from '@/content/legal-overrides';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';
import {
  LEGAL_META,
  LegalSection,
  RenderedSection,
  resolveSections,
  TERMS_SECTIONS,
} from '@/content/legal';

interface LegalDocumentProps {
  /** Заголовок экрана (из i18n) */
  title: string;
  sections: LegalSection[];
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
  onBack,
}: LegalDocumentProps) {
  const { t, lang } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // ✅ плашка о согласии — только для вошедших пользователей
  const user = useUnit($userSession);

  // ✅ язык документа выбирается отдельно от языка интерфейса и запоминается
  const [preferredLang, setPreferredLang] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(LEGAL_LANG_KEY)
      .then((value) => setPreferredLang(value ? normalizeLegalLanguage(value) : null))
      .catch(() => {});
  }, []);

  const docLang =
    preferredLang ?? (hasLegalTranslation(lang) ? lang : 'en');

  const chooseLang = (value: string) => {
    setPreferredLang(value);
    AsyncStorage.setItem(LEGAL_LANG_KEY, value).catch(() => {});
  };

  // переводы подтягиваем по выбранному языку документа
  const activeOverrides = getLegalOverrides(
    sections === TERMS_SECTIONS ? 'terms' : 'privacy',
    docLang,
  );

  // ✅ для не-английского языка показываем пометку о юридически значимой версии
  const showEnglishNote = docLang !== 'en';

  // ✅ Тексты приводятся к языку: перевод (если есть) → ru → en
  const localizedSections = resolveSections(sections, docLang, activeOverrides);
  const consentAt = user?.termsAcceptedAt ? new Date(user.termsAcceptedAt) : null;
  const consentVersion = user?.termsVersion ?? LEGAL_META.version;
  const dateLocale =
    docLang === 'ru'
      ? 'ru-RU'
      : docLang === 'pl'
        ? 'pl-PL'
        : docLang === 'lt'
          ? 'lt-LT'
          : docLang === 'uk'
            ? 'uk-UA'
            : docLang === 'be'
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
        {/* ✅ выбор языка документа (не зависит от языка приложения) */}
        <View style={styles.langRow}>
          {LEGAL_LANGUAGES.map((code) => {
            const active = code === docLang;
            return (
              <Pressable
                key={code}
                onPress={() => chooseLang(code)}
                style={[
                  styles.langChip,
                  {
                    backgroundColor: active ? colors.primary : colors.surface,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={LEGAL_LANGUAGE_LABELS[code]}
              >
                <Text
                  style={[
                    styles.langChipText,
                    { color: active ? '#FFFFFF' : colors.textSecondary },
                  ]}
                >
                  {LEGAL_LANGUAGE_LABELS[code]}
                </Text>
              </Pressable>
            );
          })}
        </View>

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

const LEGAL_LANG_KEY = 'settings_legal_lang';

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  langChip: {
    minWidth: 44,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langChipText: { fontSize: 12, fontWeight: '800' },
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
