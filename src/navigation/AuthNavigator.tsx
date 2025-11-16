import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthStackParamList } from '../types';
import { Routes } from './routes';
import LoginScreen from '../modules/auth/screens/LoginScreen';
import OtpVerificationScreen from '../modules/auth/screens/OtpVerificationScreen';
import UserDetailsScreen from '../modules/auth/screens/UserDetailsScreen';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Disable swipe back for auth flow
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ title: 'Login' }}
      />
      <Stack.Screen 
        name="OtpVerification" 
        component={OtpVerificationScreen}
        options={{ title: 'Verify OTP' }}
      />
      <Stack.Screen 
        name="UserDetails" 
        component={UserDetailsScreen}
        options={{ title: 'Your Details' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;