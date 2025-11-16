import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import { AuthStackParamList } from '@/types';
import { verifyOtp, sendOtp, clearError } from '../store/authSlice';
import { RootState, AppDispatch } from '@/store';
import { colors, spacing, typography } from '@/theme';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';

type OtpVerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'OtpVerification'>;
type OtpVerificationScreenRouteProp = RouteProp<AuthStackParamList, 'OtpVerification'>;

interface Props {
  navigation: OtpVerificationScreenNavigationProp;
  route: OtpVerificationScreenRouteProp;
}

const OtpVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    setCanResend(true);
    return undefined; // Explicit return for consistency
  }, [resendTimer]);

  const validateOtp = (otpValue: string): boolean => {
    // OTP should be 6 digits
    return /^\d{6}$/.test(otpValue);
  };

  const handleVerifyOtp = async () => {
    // Clear previous errors
    setOtpError('');
    dispatch(clearError());

    // Validate OTP
    if (!otp.trim()) {
      setOtpError('Please enter the OTP');
      return;
    }

    if (!validateOtp(otp)) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const result = await dispatch(verifyOtp({ phoneNumber, otp })).unwrap();
      
      // Check if user has basic details
      if (!result.user.name || !result.user.email || !result.user.city) {
        // Navigate to user details screen
        navigation.navigate('UserDetails', { user: result.user });
      } else {
        // User already has details, navigate to main app
        // This will be handled by the navigation logic based on auth state
      }
    } catch (error) {
      setOtpError(error as string);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    dispatch(clearError());
    setCanResend(false);
    setResendTimer(30);

    try {
      await dispatch(sendOtp(phoneNumber)).unwrap();
      Alert.alert(
        'OTP Sent!',
        `New OTP has been sent to ${phoneNumber}\n\nFor testing: Use OTP 123456`
      );
    } catch (error) {
      Alert.alert('Error', error as string);
      setCanResend(true);
      setResendTimer(0);
    }
  };

  const formatPhoneNumber = (phone: string): string => {
    if (phone.startsWith('+91')) {
      const number = phone.substring(3);
      return `+91 ${number.substring(0, 5)} ${number.substring(5)}`;
    }
    return phone;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit OTP sent to{'\n'}
              <Text style={styles.phoneNumber}>{formatPhoneNumber(phoneNumber)}</Text>
            </Text>
          </View>

          <View style={styles.form}>
            <CustomTextInput
              label="OTP"
              placeholder="123456"
              value={otp}
              onChangeText={setOtp}
              error={otpError}
              keyboardType="numeric"
              maxLength={6}
              autoFocus
              textAlign="center"
              style={styles.otpInput}
            />

            <CustomButton
              title="Verify OTP"
              onPress={handleVerifyOtp}
              loading={isLoading}
              disabled={!otp.trim() || otp.length !== 6}
            />
          </View>

          <View style={styles.resendContainer}>
            {canResend ? (
              <CustomButton
                title="Resend OTP"
                onPress={handleResendOtp}
                variant="outline"
                size="small"
              />
            ) : (
              <Text style={styles.resendTimer}>
                Resend OTP in {resendTimer}s
              </Text>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              For testing purposes, use OTP: 123456
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: typography.lineHeight.md,
  },
  phoneNumber: {
    fontWeight: '600',
    color: colors.primary,
  },
  form: {
    marginBottom: spacing.xl,
  },
  otpInput: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    letterSpacing: 4,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  resendTimer: {
    fontSize: typography.fontSize.sm,
    color: colors.onSurfaceVariant,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.fontSize.xs,
    color: colors.info,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default OtpVerificationScreen;