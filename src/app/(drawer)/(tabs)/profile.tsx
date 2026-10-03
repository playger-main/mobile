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

// Effector core state bindings
import {
  signUpFx,
  signInFx,
  verifyCodeFx,
  resendCodeFx,
  forgotPasswordFx,   // ✅ НОВОЕ
  resetPasswordFx,    // ✅ НОВОЕ
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
import AuthForgotPassword from '@/components/ui/AuthForgotPassword';   // ✅ НОВОЕ
import AuthResetPassword from '@/components/ui/AuthResetPassword';     // ✅ НОВОЕ
import UserProfile from '@/components/ui/UserProfile';

export default function ProfileHubScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Local interface states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string>('');

  // Global store parameter resolution hooks
  const { currentStep, user, isSubmitting, changeStep, handleLogout } = useUnit({
    currentStep: $authStep,
    user: $userSession,
    isSubmitting: $isAuthSubmitting,
    changeStep: setAuthStep,
    handleLogout: logout,
  });

  const navigateToHome = () => router.replace('/(drawer)/(tabs)');

  // 1. AUTHORIZED USER MODE (PROFILE PANEL)
  if (user) {
    return <UserProfile user={user} onLogout={handleLogout} />;
  }

  // 2. BASELINE ONBOARDING OVERLAY MODE (WELCOME SLIDER)
  if (currentStep === 'welcome') {
    return (
      <AuthWelcome
        onGetStarted={() => changeStep('signin')}
        bottomInset={insets.bottom}
      />
    );
  }

  // 3. REGISTRATION ENGINE INTERACTION PIPELINE
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
        err?.response?.data?.message || 'Registration failure encountered.',
      );
    }
  };

  // 4. SMART LOGIN TRAPPING & INTERCEPTION INTERACTIVE RULES
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
        setErrorMessage(
          'Your account is unverified. We have dispatched a new secure code.',
        );
        resendCodeFx(email.trim()).catch(() => {});
      } else {
        setErrorMessage(
          serverMessage || 'Invalid email or security credentials provided.',
        );
      }
    }
  };

  // 5. SECURE DIGITAL RESEND TRIGGER PIPELINE
  const handleResendCodeCall = async () => {
    if (!pendingEmail) {
      setErrorMessage('Missing target contextual email token references.');
      return;
    }
    try {
      setErrorMessage(null);
      await resendCodeFx(pendingEmail);
      Alert.alert(
        'Code Dispatched',
        'A new 6-digit tracking code has been forwarded to your inbox.',
      );
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
          'Failed to dispatch notification sequence.',
      );
    }
  };

  // 6. CODE VALIDATION TRANSACTION HANDLER
  const handleVerifyCodeSubmit = async (code: string) => {
    try {
      setErrorMessage(null);
      await verifyCodeFx(code);
      Alert.alert(
        'Verification Success',
        'Account activated successfully! Please sign in.',
        [{ text: 'OK', onPress: () => changeStep('signin') }],
      );
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
          'Invalid or expired entry code string token.',
      );
    }
  };

  // ✅ 7. FORGOT PASSWORD — запрос кода
  const handleForgotPassword = async (email: string) => {
    try {
      setErrorMessage(null);
      setPendingEmail(email.trim());
      await forgotPasswordFx(email.trim());
      // on(forgotPasswordFx.done) сам переведёт step → 'reset'
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || 'Could not send reset code.',
      );
    }
  };

  // ✅ 8. RESET PASSWORD — ввод кода + новый пароль
  const handleResetPassword = async (code: string, newPassword: string) => {
    try {
      setErrorMessage(null);
      await resetPasswordFx({
        email: pendingEmail,
        code,
        newPassword,
      });
      Alert.alert('Success', 'Password changed. Please sign in.', [
        { text: 'OK', onPress: () => changeStep('signin') },
      ]);
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || 'Invalid or expired code.',
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
      {/* Universal close button */}
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

      {/* ================= SIGN IN ================= */}
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

      {/* ================= SIGN UP ================= */}
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

      {/* ================= VERIFY CODE (регистрация) ================= */}
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

      {/* ================= FORGOT PASSWORD ================= */}
      {currentStep === 'forgot' && (
        <AuthForgotPassword
          onSubmit={handleForgotPassword}
          onBackToSignIn={handleBackToSignIn}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      )}

      {/* ================= RESET PASSWORD ================= */}
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
