// src/app/(drawer)/(tabs)/profile.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTranslation } from '@/i18n';

// Effector core state bindings
import {
  signUpFx,
  signInFx,
  verifyCodeFx,
  resendCodeFx,
  forgotPasswordFx,
  resetPasswordFx,
} from '@/effector/events/async/auth';
import {
  $authStep,
  $userSession,
  $isAuthSubmitting,
} from '@/effector/store';
import { setAuthStep, logout } from '@/effector/events/sync';

// Decoupled sub-component modules
import AuthWelcome from '@/components/ui/AuthWelcome';
import AuthSignIn from '@/components/ui/AuthSignIn';
import AuthSignUp from '@/components/ui/AuthSignUp';
import AuthVerifyCode from '@/components/ui/AuthVerifyCode';
import AuthForgotPassword from '@/components/ui/AuthForgotPassword';
import AuthResetPassword from '@/components/ui/AuthResetPassword';
import UserProfile from '@/components/ui/UserProfile';

export default function ProfileHubScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string>('');

  const { currentStep, user, isSubmitting, changeStep, handleLogout } = useUnit({
    currentStep: $authStep,
    user: $userSession,
    isSubmitting: $isAuthSubmitting,
    changeStep: setAuthStep,
    handleLogout: logout,
  });

  const navigateToHome = () => router.replace('/(drawer)/(tabs)');

  // 1. AUTHORIZED
  if (user) {
    return <UserProfile user={user} onLogout={handleLogout} />;
  }

  // 2. WELCOME
  if (currentStep === 'welcome') {
    return (
      <AuthWelcome
        onGetStarted={() => changeStep('signin')}
        bottomInset={insets.bottom}
      />
    );
  }

  // 3. SIGN UP
  const handleSignUp = async (
    fullName: string,
    email: string,
    password: string,
  ) => {
    try {
      setErrorMessage(null);
      setPendingEmail(email.trim());
      await signUpFx({
        username: fullName.trim(),
        email: email.trim(),
        password,
      });
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || t('auth.error.registrationFailed'),
      );
    }
  };

  // 4. SIGN IN
  const handleSignIn = async (email: string, password: string) => {
    try {
      setErrorMessage(null);
      await signInFx({ user: email.trim(), password });
      navigateToHome();
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message || '';
      const statusCode = err?.response?.status;

      if (
        statusCode === 400 ||
        serverMessage.toLowerCase().includes('confirm') ||
        serverMessage.toLowerCase().includes('подтвержд')
      ) {
        setPendingEmail(email.trim());
        changeStep('verify');
        setErrorMessage(t('auth.error.accountUnverified'));
        resendCodeFx(email.trim()).catch(() => {});
      } else {
        setErrorMessage(
          serverMessage || t('auth.error.invalidCredentials'),
        );
      }
    }
  };

  // 5. RESEND CODE
  const handleResendCodeCall = async () => {
    if (!pendingEmail) {
      setErrorMessage(t('auth.error.missingEmail'));
      return;
    }
    try {
      setErrorMessage(null);
      await resendCodeFx(pendingEmail);
      Alert.alert(t('auth.error.codeSent'), t('auth.error.newCodeSent'));
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || t('auth.error.couldNotSendCode'),
      );
    }
  };

  // 6. VERIFY CODE
  const handleVerifyCodeSubmit = async (code: string) => {
    try {
      setErrorMessage(null);
      await verifyCodeFx(code);
      Alert.alert(
        t('auth.verify.successTitle'),
        t('auth.verify.successMessage'),
        [{ text: t('common.ok'), onPress: () => changeStep('signin') }],
      );
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || t('auth.error.invalidCode'),
      );
    }
  };

  // 7. FORGOT PASSWORD
  const handleForgotPassword = async (email: string) => {
    try {
      setErrorMessage(null);
      setPendingEmail(email.trim());
      await forgotPasswordFx(email.trim());
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || t('auth.error.couldNotSendCode'),
      );
    }
  };

  // 8. RESET PASSWORD
  const handleResetPassword = async (code: string, newPassword: string) => {
    try {
      setErrorMessage(null);
      await resetPasswordFx({
        email: pendingEmail,
        code,
        newPassword,
      });
      Alert.alert(t('auth.reset.successTitle'), t('auth.reset.successMessage'), [
        { text: t('common.ok'), onPress: () => changeStep('signin') },
      ]);
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || t('auth.error.invalidCode'),
      );
    }
  };

  const handleBackToSignIn = () => {
    changeStep('signin');
    setErrorMessage(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Pressable
        style={[styles.closeButton, { top: insets.top + 12 }]}
        onPress={() => {
          changeStep('welcome');
          setErrorMessage(null);
        }}
        hitSlop={12}
      >
        <Ionicons name="close" size={24} color="#334A77" />
      </Pressable>

      {currentStep === 'signin' && (
        <AuthSignIn
          onSubmit={handleSignIn}
          onSwitchToSignUp={() => {
            changeStep('signup');
            setErrorMessage(null);
          }}
          onContinueAsGuest={navigateToHome}
          onForgotPassword={() => {
            changeStep('forgot');
            setErrorMessage(null);
          }}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      )}

      {currentStep === 'signup' && (
        <AuthSignUp
          onSubmit={handleSignUp}
          onSwitchToSignIn={() => {
            changeStep('signin');
            setErrorMessage(null);
          }}
          onContinueAsGuest={navigateToHome}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      )}

      {currentStep === 'verify' && (
        <AuthVerifyCode
          onSubmit={handleVerifyCodeSubmit}
          onResendCode={handleResendCodeCall}
          onBackToSignUp={() => {
            changeStep('signup');
            setErrorMessage(null);
          }}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      )}

      {currentStep === 'forgot' && (
        <AuthForgotPassword
          onSubmit={handleForgotPassword}
          onBackToSignIn={handleBackToSignIn}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      )}

      {currentStep === 'reset' && (
        <AuthResetPassword
          email={pendingEmail}
          onSubmit={handleResetPassword}
          onResendCode={() => handleForgotPassword(pendingEmail)}
          onBackToSignIn={handleBackToSignIn}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
    zIndex: 10,
  },
});