// src/components/ui/ReportSheet.tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useUnit } from 'effector-react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { $reportTarget, closeReport } from '@/effector/store';
import {
  ReportReason,
  submitReportFx,
} from '@/effector/events/async/reports';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

/** ✅ Пункты жалобы — те же, что в бэкенде (ReportReason) */
const REASONS: { code: ReportReason; labelKey: string }[] = [
  { code: 'spam', labelKey: 'report.reason.spam' },
  { code: 'abuse', labelKey: 'report.reason.abuse' },
  { code: 'illegal', labelKey: 'report.reason.illegal' },
  { code: 'nudity', labelKey: 'report.reason.nudity' },
  { code: 'other', labelKey: 'report.reason.other' },
];

const MAX_COMMENT = 500;

export default function ReportSheet() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const target = useUnit($reportTarget);
  const close = useUnit(closeReport);
  const submit = useUnit(submitReportFx);
  const pending = useUnit(submitReportFx.pending);

  const [reason, setReason] = useState<ReportReason | null>(null);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // сбрасываем состояние при открытии/закрытии
  useEffect(() => {
    if (!target) {
      setReason(null);
      setComment('');
      setSent(false);
      setError(null);
    }
  }, [target]);

  const handleSubmit = async () => {
    if (!target || !reason || pending) return;

    setError(null);
    try {
      await submit({
        targetType: target.targetType,
        targetId: target.targetId,
        reason,
        comment: comment.trim() ? comment.trim() : undefined,
      });
      setSent(true);
      setTimeout(() => close(), 1400);
    } catch (e: any) {
      const status = e?.response?.status;
      setError(
        status === 409 ? t('report.already') : t('report.error'),
      );
    }
  };

  return (
    <Modal
      visible={!!target}
      transparent
      animationType="fade"
      onRequestClose={close}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={close}>
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              paddingBottom: insets.bottom + 16,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View
            style={[styles.header, { borderBottomColor: colors.borderSubtle }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {t('report.title')}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
                {target?.subject
                  ? `${t('report.subtitle')} · ${target.subject}`
                  : t('report.subtitle')}
              </Text>
            </View>
            <Pressable
              onPress={close}
              hitSlop={10}
              style={[styles.closeBtn, { backgroundColor: colors.surfaceSecondary }]}
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          {sent ? (
            // ✅ успех: не закрываем мгновенно, чтобы человек увидел подтверждение
            <View style={styles.sentBlock}>
              <Ionicons
                name="checkmark-circle"
                size={44}
                color={colors.accent}
              />
              <Text style={[styles.sentText, { color: colors.textPrimary }]}>
                {t('report.sent')}
              </Text>
            </View>
          ) : (
            <ScrollView
              style={{ maxHeight: 420 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.list}>
                {REASONS.map((item) => {
                  const active = reason === item.code;
                  return (
                    <Pressable
                      key={item.code}
                      onPress={() => setReason(item.code)}
                      style={[
                        styles.reasonRow,
                        { borderColor: active ? colors.primary : colors.borderSubtle },
                        active && { backgroundColor: colors.primaryBg },
                      ]}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: active }}
                      accessibilityLabel={t(item.labelKey)}
                    >
                      <Ionicons
                        name={active ? 'radio-button-on' : 'radio-button-off'}
                        size={20}
                        color={active ? colors.primary : colors.textTertiary}
                      />
                      <Text
                        style={[
                          styles.reasonText,
                          { color: active ? colors.primary : colors.textPrimary },
                        ]}
                      >
                        {t(item.labelKey)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <TextInput
                value={comment}
                onChangeText={(value) => setComment(value.slice(0, MAX_COMMENT))}
                placeholder={t('report.commentPlaceholder')}
                placeholderTextColor={colors.textTertiary}
                multiline
                style={[
                  styles.commentInput,
                  {
                    color: colors.textPrimary,
                    borderColor: colors.borderSubtle,
                    backgroundColor: colors.surfaceSecondary,
                  },
                ]}
                accessibilityLabel={t('report.commentPlaceholder')}
              />

              {error && (
                <Text style={[styles.error, { color: colors.danger }]}>
                  {error}
                </Text>
              )}

              <Pressable
                onPress={handleSubmit}
                disabled={!reason || pending}
                style={({ pressed }) => [
                  styles.submitBtn,
                  {
                    backgroundColor: colors.primary,
                    opacity: !reason || pending ? 0.5 : pressed ? 0.85 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={t('report.submit')}
                accessibilityState={{ disabled: !reason || pending, busy: pending }}
              >
                {pending ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitText}>{t('report.submit')}</Text>
                )}
              </Pressable>
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  list: { paddingHorizontal: 16, paddingTop: 8 },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  reasonText: { fontSize: 15, fontWeight: '600' },
  commentInput: {
    marginHorizontal: 16,
    marginTop: 6,
    minHeight: 84,
    maxHeight: 140,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  error: { marginHorizontal: 16, marginTop: 8, fontSize: 13, fontWeight: '600' },
  submitBtn: {
    marginHorizontal: 16,
    marginTop: 14,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  sentBlock: { alignItems: 'center', paddingVertical: 36, gap: 12 },
  sentText: { fontSize: 15, fontWeight: '600', textAlign: 'center' },
});
