// Navigation routes constants
export const Routes = {
  // Auth stack
  AUTH_STACK: 'AuthStack',
  LOGIN: 'Login',
  OTP_VERIFICATION: 'OtpVerification',
  USER_DETAILS: 'UserDetails',
  
  // Main stack
  MAIN_STACK: 'MainStack',
  MAIN_TABS: 'MainTabs',
  
  // Tab screens
  MAP: 'Map',
  PROFILE: 'Profile',
  CHAT: 'Chat',
  SAVED: 'Saved',
  CONTRIBUTION: 'Contribution',
  FLAG: 'Flag',
  ABOUT: 'About',
  
  // Future modal/additional screens
  POST_DETAILS: 'PostDetails',
  CREATE_POST: 'CreatePost',
  CREATE_REVIEW: 'CreateReview',
  CHAT_CONVERSATION: 'ChatConversation',
} as const;

// Bottom tab configuration
export const BottomTabConfig = [
  {
    name: Routes.MAP,
    title: 'Home',
    iconName: 'home',
    iconFamily: 'MaterialIcons' as const,
  },
  {
    name: Routes.PROFILE,
    title: 'Profile',
    iconName: 'person',
    iconFamily: 'MaterialIcons' as const,
  },
  {
    name: Routes.CHAT,
    title: 'Chat',
    iconName: 'chat',
    iconFamily: 'MaterialIcons' as const,
  },
  {
    name: Routes.SAVED,
    title: 'Saved',
    iconName: 'bookmark',
    iconFamily: 'MaterialIcons' as const,
  },
  {
    name: Routes.CONTRIBUTION,
    title: 'Reviews',
    iconName: 'star',
    iconFamily: 'MaterialIcons' as const,
  },
  {
    name: Routes.FLAG,
    title: 'Flag',
    iconName: 'flag',
    iconFamily: 'MaterialIcons' as const,
  },
  {
    name: Routes.ABOUT,
    title: 'About',
    iconName: 'info',
    iconFamily: 'MaterialIcons' as const,
  },
] as const;