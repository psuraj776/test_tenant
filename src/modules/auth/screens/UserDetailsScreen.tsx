import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import { AuthStackParamList, User } from '../../../types';
import { updateUserDetails, clearError } from '../store/authSlice';
import { RootState, AppDispatch } from '../../../store';
import { colors, spacing, typography } from '../../../theme';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';

type UserDetailsScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'UserDetails'>;
type UserDetailsScreenRouteProp = RouteProp<AuthStackParamList, 'UserDetails'>;

interface Props {
  navigation: UserDetailsScreenNavigationProp;
  route: UserDetailsScreenRouteProp;
}

interface FormData {
  name: string;
  email: string;
  city: string;
  // Future extensible fields can be added here
}

interface FormErrors {
  name?: string;
  email?: string;
  city?: string;
}

const UserDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = route.params;
  
  // Initialize form with existing user data if available
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || '',
    email: user?.email || '',
    city: user?.city || '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  // Field update handler
  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = 'Name can only contain letters and spaces';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (formData.city.trim().length < 2) {
      newErrors.city = 'City must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleContinue = async () => {
    // Clear previous errors
    dispatch(clearError());
    
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare user data for update
      const updatedUserData: Partial<User> = {
        ...user,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        city: formData.city.trim(),
        // Future fields can be added here
        // additionalDetails: { /* future data */ }
      };

      await dispatch(updateUserDetails(updatedUserData)).unwrap();
      
      // Success! The navigation will automatically happen via RootNavigator
      // since the user state will be updated with complete details
      
    } catch (error) {
      Alert.alert('Error', error as string);
    }
  };

  // Check if form is valid for enabling continue button
  const isFormValid = formData.name.trim() && formData.email.trim() && formData.city.trim();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Tell us about yourself</Text>
              <Text style={styles.subtitle}>
                We need some basic information to personalize your experience
              </Text>
            </View>

            <View style={styles.form}>
              <CustomTextInput
                label="Full Name *"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                {...(errors.name && { error: errors.name })}
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={50}
              />

              <CustomTextInput
                label="Email Address *"
                placeholder="your.email@example.com"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                {...(errors.email && { error: errors.email })}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={100}
              />

              <CustomTextInput
                label="City *"
                placeholder="Enter your city"
                value={formData.city}
                onChangeText={(value) => updateField('city', value)}
                {...(errors.city && { error: errors.city })}
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={50}
              />

              {/* Future extensible fields placeholder */}
              {/* 
              <CustomTextInput
                label="Future Field"
                placeholder="Future input..."
                value={formData.futureField}
                onChangeText={(value) => updateField('futureField', value)}
              />
              */}

              <CustomButton
                title="Continue"
                onPress={handleContinue}
                loading={isLoading}
                disabled={!isFormValid}
                style={styles.continueButton}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                * Required fields{'\n'}
                You can update these details later in your profile
              </Text>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    minHeight: '100%',
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
  continueButton: {
    marginTop: spacing.lg,
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

export default UserDetailsScreen;