import React, { useState } from 'react';
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
import { sendOtp, clearError } from '../store/authSlice';
import { RootState, AppDispatch } from '@/store';
import { colors, spacing, typography } from '@/theme';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if it's a valid Indian mobile number
    if (cleanPhone.length === 10 && cleanPhone.match(/^[6-9]\d{9}$/)) {
      return true;
    } else if (cleanPhone.length === 12 && cleanPhone.startsWith('91') && cleanPhone.substring(2).match(/^[6-9]\d{9}$/)) {
      return true;
    } else if (cleanPhone.length === 13 && cleanPhone.startsWith('+91') && cleanPhone.substring(3).match(/^[6-9]\d{9}$/)) {
      return true;
    }
    
    return false;
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // If it starts with +91, keep as is
    if (cleaned.startsWith('+91')) {
      return cleaned;
    }
    
    // If it starts with 91, add +
    if (cleaned.startsWith('91') && cleaned.length > 10) {
      return '+' + cleaned;
    }
    
    // If it's a 10-digit number, add +91
    if (cleaned.length === 10) {
      return '+91' + cleaned;
    }
    
    return cleaned;
  };

  const handleSendOtp = async () => {
    // Clear previous errors
    setPhoneError('');
    dispatch(clearError());

    // Validate phone number
    if (!phoneNumber.trim()) {
      setPhoneError('Please enter your phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError('Please enter a valid phone number');
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    try {
      await dispatch(sendOtp(formattedPhone)).unwrap();
      
      // Show success message with hardcoded OTP
      Alert.alert(
        'OTP Sent!',
        `OTP has been sent to ${formattedPhone}\n\nFor testing: Use OTP 123456`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('OtpVerification', { phoneNumber: formattedPhone }),
          },
        ]
      );
    } catch (error) {
      // Error is handled by Redux, just show it
      Alert.alert('Error', error as string);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to Tenant Community</Text>
            <Text style={styles.subtitle}>
              Enter your phone number to get started
            </Text>
          </View>

          <View style={styles.form}>
            <CustomTextInput
              label="Phone Number"
              placeholder="+91 9876543210"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              error={phoneError}
              keyboardType="phone-pad"
              maxLength={15}
              autoFocus
            />

            <CustomButton
              title="Send OTP"
              onPress={handleSendOtp}
              loading={isLoading}
              disabled={!phoneNumber.trim()}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
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
  form: {
    marginBottom: spacing.xl,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.fontSize.xs,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: typography.lineHeight.sm,
  },
});

export default LoginScreen;