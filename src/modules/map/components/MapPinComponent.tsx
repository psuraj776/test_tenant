import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@/theme';
import { MapPin } from '@/types/mapTypes';

interface MapPinComponentProps {
  pin: MapPin;
  onPress: (pin: MapPin) => void;
  isSelected?: boolean;
}

const MapPinComponent: React.FC<MapPinComponentProps> = ({
  pin,
  onPress,
  isSelected = false,
}) => {
  const getPostTypeIcon = (type: string): string => {
    switch (type) {
      case 'flat':
        return '🏠';
      case 'flatmate':
        return '👥';
      case 'review':
        return '⭐';
      case 'sell':
        return '🛒';
      default:
        return '📍';
    }
  };

  const getPostTypeLabel = (type: string): string => {
    switch (type) {
      case 'flat':
        return 'Flat';
      case 'flatmate':
        return 'Flatmate';
      case 'review':
        return 'Review';
      case 'sell':
        return 'Sell';
      default:
        return 'Post';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.pinContainer,
        { borderColor: pin.color },
        isSelected && styles.selectedPin,
      ]}
      onPress={() => onPress(pin)}
      activeOpacity={0.7}
    >
      <View style={[styles.pinIcon, { backgroundColor: pin.color }]}>
        <Text style={styles.iconText}>{getPostTypeIcon(pin.type)}</Text>
      </View>
      
      {isSelected && (
        <View style={styles.callout}>
          <Text style={styles.calloutTitle} numberOfLines={1}>
            {pin.title}
          </Text>
          <Text style={styles.calloutType}>
            {getPostTypeLabel(pin.type)}
          </Text>
          <Text style={styles.calloutAge}>
            {pin.ageInDays === 0 ? 'Today' : 
             pin.ageInDays === 1 ? '1 day ago' : 
             `${pin.ageInDays} days ago`}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pinContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pinIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
    ...shadows.md,
  },
  selectedPin: {
    zIndex: 1000,
  },
  iconText: {
    fontSize: 16,
    lineHeight: 18,
  },
  callout: {
    position: 'absolute',
    top: -100,
    minWidth: 150,
    maxWidth: 200,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    ...shadows.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  calloutTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: spacing.xs / 2,
  },
  calloutType: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: spacing.xs / 2,
  },
  calloutAge: {
    fontSize: typography.fontSize.xs,
    color: colors.onSurfaceVariant,
  },
});

export default MapPinComponent;