import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { logout } from '@/modules/auth/store/authSlice';
import { colors, spacing, typography, borderRadius, shadows } from '@/theme';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen
    console.log('Edit profile pressed');
  };

  const ProfileItem = ({ title, value, onPress }: { title: string; value: string; onPress?: () => void }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.profileItemContent}>
        <Text style={styles.profileItemTitle}>{title}</Text>
        <Text style={styles.profileItemValue}>{value}</Text>
      </View>
      {onPress && <Text style={styles.profileItemArrow}>›</Text>}
    </TouchableOpacity>
  );

  const MenuSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const MenuItem = ({ title, icon, onPress }: { title: string; icon: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuIcon}>{icon}</Text>
        <Text style={styles.menuItemTitle}>{title}</Text>
      </View>
      <Text style={styles.menuItemArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </Text>
            </View>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userPhone}>{user?.phoneNumber}</Text>
          
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Information */}
        <MenuSection title="Profile Information">
          <ProfileItem title="Name" value={user?.name || 'Not provided'} onPress={handleEditProfile} />
          <ProfileItem title="Email" value={user?.email || 'Not provided'} onPress={handleEditProfile} />
          <ProfileItem title="City" value={user?.city || 'Not provided'} onPress={handleEditProfile} />
          <ProfileItem title="Phone" value={user?.phoneNumber || 'Not provided'} />
          <ProfileItem 
            title="Verification Status" 
            value={user?.isVerified ? '✅ Verified' : '⏳ Pending'} 
          />
        </MenuSection>

        {/* App Features */}
        <MenuSection title="Your Activity">
          <MenuItem 
            title="My Posts" 
            icon="📝" 
            onPress={() => console.log('My Posts pressed')} 
          />
          <MenuItem 
            title="My Reviews" 
            icon="⭐" 
            onPress={() => console.log('My Reviews pressed')} 
          />
          <MenuItem 
            title="Saved Items" 
            icon="📌" 
            onPress={() => console.log('Saved Items pressed')} 
          />
          <MenuItem 
            title="Chat History" 
            icon="💬" 
            onPress={() => console.log('Chat History pressed')} 
          />
        </MenuSection>

        {/* App Settings */}
        <MenuSection title="Settings">
          <MenuItem 
            title="Notifications" 
            icon="🔔" 
            onPress={() => console.log('Notifications pressed')} 
          />
          <MenuItem 
            title="Privacy Settings" 
            icon="🔒" 
            onPress={() => console.log('Privacy Settings pressed')} 
          />
          <MenuItem 
            title="Location Preferences" 
            icon="📍" 
            onPress={() => console.log('Location Preferences pressed')} 
          />
          <MenuItem 
            title="App Preferences" 
            icon="⚙️" 
            onPress={() => console.log('App Preferences pressed')} 
          />
        </MenuSection>

        {/* Support */}
        <MenuSection title="Support & Info">
          <MenuItem 
            title="Help & Support" 
            icon="❓" 
            onPress={() => console.log('Help & Support pressed')} 
          />
          <MenuItem 
            title="Terms of Service" 
            icon="📄" 
            onPress={() => console.log('Terms of Service pressed')} 
          />
          <MenuItem 
            title="Privacy Policy" 
            icon="🔐" 
            onPress={() => console.log('Privacy Policy pressed')} 
          />
          <MenuItem 
            title="Rate App" 
            icon="⭐" 
            onPress={() => console.log('Rate App pressed')} 
          />
        </MenuSection>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Tenant Community v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  userName: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.background,
    marginBottom: spacing.xs,
  },
  userPhone: {
    fontSize: typography.fontSize.md,
    color: colors.background,
    opacity: 0.9,
    marginBottom: spacing.md,
  },
  editButton: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  editButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },
  menuSection: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  sectionContent: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  profileItemContent: {
    flex: 1,
  },
  profileItemTitle: {
    fontSize: typography.fontSize.sm,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs / 2,
  },
  profileItemValue: {
    fontSize: typography.fontSize.md,
    color: colors.onSurface,
    fontWeight: '500',
  },
  profileItemArrow: {
    fontSize: 20,
    color: colors.onSurfaceVariant,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  menuItemTitle: {
    fontSize: typography.fontSize.md,
    color: colors.onSurface,
  },
  menuItemArrow: {
    fontSize: 20,
    color: colors.onSurfaceVariant,
  },
  logoutSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  logoutButton: {
    backgroundColor: colors.error,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    ...shadows.sm,
  },
  logoutButtonText: {
    color: colors.background,
    fontSize: typography.fontSize.md,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  footerText: {
    fontSize: typography.fontSize.xs,
    color: colors.onSurfaceVariant,
  },
});

export default ProfileScreen;