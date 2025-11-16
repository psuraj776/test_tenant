import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import { MainTabParamList } from '../types';
import { colors } from '../theme';
import MapScreen from '../modules/map/screens/MapScreen';
import ProfileScreen from '../modules/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Placeholder screens for remaining tabs
const ChatScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    <Text style={{ fontSize: 18, marginBottom: 10 }}>💬 Chat Screen</Text>
    <Text style={{ textAlign: 'center', color: '#666' }}>
      Real-time messaging feature coming soon!
    </Text>
  </View>
);

const SavedScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    <Text style={{ fontSize: 18, marginBottom: 10 }}>📌 Saved Items</Text>
    <Text style={{ textAlign: 'center', color: '#666' }}>
      Your bookmarked properties and posts will appear here
    </Text>
  </View>
);

const ContributionScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    <Text style={{ fontSize: 18, marginBottom: 10 }}>⭐ Reviews & Contributions</Text>
    <Text style={{ textAlign: 'center', color: '#666' }}>
      Your property reviews and community contributions
    </Text>
  </View>
);

const FlagScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    <Text style={{ fontSize: 18, marginBottom: 10 }}>🚩 Report Issues</Text>
    <Text style={{ textAlign: 'center', color: '#666' }}>
      Report inappropriate content or property issues
    </Text>
  </View>
);

const AboutScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    <Text style={{ fontSize: 18, marginBottom: 10 }}>ℹ️ About Tenant Community</Text>
    <Text style={{ textAlign: 'center', color: '#666', marginBottom: 20 }}>
      Your trusted platform for finding homes, flatmates, and community reviews
    </Text>
    <Text style={{ textAlign: 'center', color: '#999' }}>
      Version 1.0.0
    </Text>
  </View>
);

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Map"
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>💬</Text>,
        }}
      />
      <Tab.Screen 
        name="Saved" 
        component={SavedScreen}
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📌</Text>,
        }}
      />
      <Tab.Screen 
        name="Contribution" 
        component={ContributionScreen}
        options={{
          title: 'Reviews',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⭐</Text>,
        }}
      />
      <Tab.Screen 
        name="Flag" 
        component={FlagScreen}
        options={{
          title: 'Flag',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🚩</Text>,
        }}
      />
      <Tab.Screen 
        name="About" 
        component={AboutScreen}
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>ℹ️</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;