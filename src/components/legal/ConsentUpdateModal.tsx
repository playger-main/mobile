// src/components/legal/ConsentUpdateModal.tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useRouter } from 'expo-router';
import { useUnit } from 'effector-react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  $userSession,
  acceptTermsFx,
  logout as logoutEvent,
} from '@/effector/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LEGAL_META } from '@/content/legal';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

/**
 * ✅ Однократное согласие с актуальной редакцией документов.
 *
 * Показывается, если пользователь вошёл и:
 *   - согласие ещё не зафиксировано (аккаунты, созданные до этой механики), или
 *   - принята другая редакция документов (текст обновился).
 *
 * Пока не примет — модалка не закрывается; можно только выйти из аккаунта.
 */
export default function ConsentUpdateModal() {
  const { t, lang } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const user = useUnit($userSession);
  const accept = useUnit(acceptTermsFx);
  const acceptPending = useUnit(acceptTermsFx.pending);
  const logout = useUnit(logoutEvent);

  const [checked, setChecked] = useState(false);
  const [docLang, setDocLang] = useState<string | null>(null);

  // ✅ фиксируем язык документа, который пользователь читал
  useEffect(() => {
    AsyncStorage.getItem(LEGAL_LANG_KEY)
      .then((value) => setDocLang(value))
      .catch(() => {});
  }, []);

  // ✅ не мигаем модалкой, пока профиль не загружен (после входа сессия идёт из токена)
  const consentKnown = !!user?.termsKnown;
  const isFirstTime = !!user && consentKnown && !user.termsAcceptedAt;
  const isOutdated =
    !!user &&
    consentKnown &&
    !!user.termsAcceptedAt &&
    user.termsVersion !== LEGAL_META.version;
  const visible = isFirstTime || isOutdated;

  if (!visible) return null;

  const title = isFirstTime
    ? t('consent.update.firstTitle')
    : t('consent.update.title');
  const body = isFirstTime
    ? t('consent.update.firstBody')
    : t('consent.update.body');

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              paddingBottom: insets.bottom + 16,
            },
          ]}
        >
          <View style={styles.header}>
            <Ionicons
              name="document-text-outline"
              size={26}
              color={colors.primary}
            />
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {title}
            </Text>
          </View>

          <ScrollView style={styles.bodyScroll} showsVerticalScrollIndicator={false}>
            <Text style={[styles.body, { color: colors.textSecondary }]}>
              {body}
            </Text>

            <View style={styles.links}>
              <Pressable
                onPress={() => router.push('/(drawer)/terms')}
                accessibilityRole="link"
                accessibilityLabel={t('legal.terms.title')}
                hitSlop={6}
              >
                <Text style={[styles.link, { color: colors.primary }]}>
                  {t('legal.terms.title')}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => router.push('/(drawer)/privacy')}
                accessibilityRole="link"
                accessibilityLabel={t('legal.privacy.title')}
                hitSlop={6}
              >
                <Text style={[styles.link, { color: colors.primary }]}>
                  {t('legal.privacy.title')}
                </Text>
              </Pressable>
            </View>
          </ScrollView>

          <Pressable
            style={styles.checkRow}
            onPress={() => setChecked((value) => !value)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked }}
            accessibilityLabel={t('consent.update.consentLabel')}
            hitSlop={6}
          >
            <Ionicons
              name={checked ? 'checkbox' : 'square-outline'}
              size={22}
              color={checked ? colors.primary : colors.textTertiary}
            />
            <Text style={[styles.checkText, { color: colors.textSecondary }]}>
              {t('consent.update.consentLabel')}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => accept({ language: docLang ?? lang })}
            disabled={!checked || acceptPending}
            style={({ pressed }) => [
              styles.primaryBtn,
              {
                backgroundColor: colors.primary,
                opacity: !checked || acceptPending ? 0.5 : pressed ? 0.85 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={t('consent.update.accept')}
            accessibilityState={{
              disabled: !checked || acceptPending,
              busy: acceptPending,
            }}
          >
            {acceptPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {t('consent.update.accept')}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => logout()}
            style={styles.secondaryBtn}
            accessibilityRole="button"
            accessibilityLabel={t('consent.update.logout')}
          >
            <Text style={[styles.secondaryText, { color: colors.textTertiary }]}>
              {t('consent.update.logout')}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const LEGAL_LANG_KEY = 'settings_legal_lang';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { flex: 1, fontSize: 18, fontWeight: '800' },
  bodyScroll: { maxHeight: 240, marginTop: 12 },
  body: { fontSize: 14, lineHeight: 21 },
  links: { marginTop: 12, gap: 8, paddingBottom: 4 },
  link: { fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  checkText: { flex: 1, fontSize: 13, lineHeight: 19 },
  primaryBtn: {
    marginTop: 16,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  secondaryBtn: { marginTop: 10, alignItems: 'center', paddingVertical: 6 },
  secondaryText: { fontSize: 13, fontWeight: '600' },
});
