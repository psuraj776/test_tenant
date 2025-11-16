module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/modules': './src/modules',
          '@/services': './src/services',
          '@/store': './src/store',
          '@/navigation': './src/navigation',
          '@/types': './src/types',
          '@/utils': './src/utils',
          '@/theme': './src/theme',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};