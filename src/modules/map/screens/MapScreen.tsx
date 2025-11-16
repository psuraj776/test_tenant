import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { colors, spacing, shadows, borderRadius } from '@/theme';
import { RootState, AppDispatch } from '@/store';
import { 
  loadMapPins, 
  setRegion, 
  setSelectedPin, 
  getUserLocation 
} from '../store/mapSlice';
import SearchBar from '../components/SearchBar';
import MapPinComponent from '../components/MapPinComponent';
import { MapPin, MapRegion } from '@/types/mapTypes';

const { width, height } = Dimensions.get('window');

const MapScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    region, 
    pins, 
    selectedPin, 
    isLoading, 
    error, 
    userLocation 
  } = useSelector((state: RootState) => state.map);

  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Load initial map data
    dispatch(loadMapPins(region));
    
    // Get user location
    dispatch(getUserLocation());
  }, [dispatch]);

  useEffect(() => {
    // Reload pins when region changes significantly
    if (mapReady) {
      dispatch(loadMapPins(region));
    }
  }, [region, mapReady, dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleRegionChange = (newRegion: MapRegion) => {
    dispatch(setRegion(newRegion));
  };

  const handlePinPress = (pin: MapPin) => {
    dispatch(setSelectedPin(selectedPin?.id === pin.id ? null : pin));
  };

  const handleMapPress = () => {
    // Clear selected pin when map is pressed
    if (selectedPin) {
      dispatch(setSelectedPin(null));
    }
  };

  const centerOnUserLocation = () => {
    if (userLocation) {
      const newRegion: MapRegion = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      dispatch(setRegion(newRegion));
    } else {
      dispatch(getUserLocation());
    }
  };

  // Mock map component since react-native-maps might not be available
  const MockMapView = () => (
    <View style={styles.mapContainer}>
      <TouchableOpacity 
        style={styles.mapTouchable}
        onPress={handleMapPress}
        activeOpacity={1}
      >
        <View style={styles.mapBackground}>
          <Text style={styles.mapLabel}>Interactive Map View</Text>
          <Text style={styles.mapSubLabel}>
            Latitude: {region.latitude.toFixed(4)}{'\n'}
            Longitude: {region.longitude.toFixed(4)}
          </Text>
          
          {/* Render pins */}
          {pins.map((pin) => (
            <View
              key={pin.id}
              style={[
                styles.pinPosition,
                {
                  left: width * 0.5 + (pin.longitude - region.longitude) * 1000,
                  top: height * 0.4 + (region.latitude - pin.latitude) * 1000,
                }
              ]}
            >
              <MapPinComponent
                pin={pin}
                onPress={handlePinPress}
                isSelected={selectedPin?.id === pin.id}
              />
            </View>
          ))}

          {/* User location indicator */}
          {userLocation && (
            <View
              style={[
                styles.userLocationIndicator,
                {
                  left: width * 0.5 + (userLocation.longitude - region.longitude) * 1000,
                  top: height * 0.4 + (region.latitude - userLocation.latitude) * 1000,
                }
              ]}
            >
              <View style={styles.userLocationDot} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>

      {/* Map View */}
      <MockMapView />
      
      {/* Controls */}
      <View style={styles.controlsContainer}>
        {/* Center on user location button */}
        <TouchableOpacity
          style={styles.locationButton}
          onPress={centerOnUserLocation}
        >
          <Text style={styles.locationButtonText}>📍</Text>
        </TouchableOpacity>

        {/* Floating Action Button for creating posts */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            Alert.alert('Create Post', 'Post creation feature coming soon!');
          }}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Pin Details Bottom Sheet */}
      {selectedPin && (
        <View style={styles.bottomSheet}>
          <TouchableOpacity
            style={styles.bottomSheetHandle}
            onPress={() => dispatch(setSelectedPin(null))}
          >
            <View style={styles.handle} />
          </TouchableOpacity>
          
          <View style={styles.bottomSheetContent}>
            <View style={styles.pinTypeContainer}>
              <View style={[styles.pinTypeBadge, { backgroundColor: selectedPin.color }]}>
                <Text style={styles.pinTypeText}>
                  {selectedPin.type.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <Text style={styles.bottomSheetTitle}>{selectedPin.title}</Text>
            <Text style={styles.bottomSheetDescription}>{selectedPin.description}</Text>
            
            <View style={styles.bottomSheetMeta}>
              <Text style={styles.metaText}>
                {selectedPin.ageInDays === 0 ? 'Posted today' : 
                 selectedPin.ageInDays === 1 ? 'Posted 1 day ago' : 
                 `Posted ${selectedPin.ageInDays} days ago`}
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.viewDetailsButton}
              onPress={() => {
                Alert.alert('View Details', 'Pin details view coming soon!');
              }}
            >
              <Text style={styles.viewDetailsButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading map data...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBarContainer: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.md,
    right: spacing.md,
    zIndex: 1000,
  },
  mapContainer: {
    flex: 1,
  },
  mapTouchable: {
    flex: 1,
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#E8F5E8',
    position: 'relative',
  },
  mapLabel: {
    position: 'absolute',
    top: height * 0.4,
    left: width * 0.5 - 75,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    ...shadows.sm,
  },
  mapSubLabel: {
    position: 'absolute',
    top: height * 0.4 + 60,
    left: width * 0.5 - 75,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    backgroundColor: colors.background,
    padding: spacing.xs,
    borderRadius: borderRadius.xs,
    ...shadows.sm,
  },
  pinPosition: {
    position: 'absolute',
    zIndex: 100,
  },
  userLocationIndicator: {
    position: 'absolute',
    zIndex: 50,
  },
  userLocationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.background,
    ...shadows.sm,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.md,
    alignItems: 'flex-end',
  },
  locationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationButtonText: {
    fontSize: 20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  fabText: {
    fontSize: 24,
    color: colors.background,
    fontWeight: 'bold',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    ...shadows.lg,
    paddingBottom: spacing.lg,
  },
  bottomSheetHandle: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.onSurfaceVariant,
    opacity: 0.3,
  },
  bottomSheetContent: {
    paddingHorizontal: spacing.lg,
  },
  pinTypeContainer: {
    marginBottom: spacing.sm,
  },
  pinTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  pinTypeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.background,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  bottomSheetDescription: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  bottomSheetMeta: {
    marginBottom: spacing.md,
  },
  metaText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  viewDetailsButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  viewDetailsButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  loadingContainer: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    ...shadows.lg,
  },
  loadingText: {
    fontSize: 14,
    color: colors.onSurface,
  },
});

export default MapScreen;