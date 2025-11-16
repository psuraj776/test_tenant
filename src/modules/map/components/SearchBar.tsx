import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { colors, spacing, typography, borderRadius, shadows } from '../../../theme';
import { RootState, AppDispatch } from '../../../store';
import { searchLocation, setSearchQuery, clearSearchResults, setRegion } from '../store/mapSlice';
import { SearchLocation } from '../../../types/mapTypes';

interface SearchBarProps {
  onLocationSelect?: (location: SearchLocation) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { searchQuery, searchResults, isLoading } = useSelector((state: RootState) => state.map);

  const handleSearchTextChange = (text: string) => {
    dispatch(setSearchQuery(text));

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    if (text.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        dispatch(searchLocation(text));
      }, 300);
    } else {
      dispatch(clearSearchResults());
      setShowResults(false);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding results to allow for item selection
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  const handleLocationSelect = (location: SearchLocation) => {
    dispatch(setSearchQuery(location.name));
    
    // Center map on selected location
    dispatch(setRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }));

    setShowResults(false);
    onLocationSelect?.(location);
  };

  const clearSearch = () => {
    dispatch(clearSearchResults());
    setShowResults(false);
  };

  const renderSearchResult = ({ item }: { item: SearchLocation }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleLocationSelect(item)}
    >
      <View style={styles.resultIconContainer}>
        <Text style={styles.resultIcon}>
          {item.type === 'area' ? '📍' : item.type === 'city' ? '🏙️' : '🗺️'}
        </Text>
      </View>
      <View style={styles.resultTextContainer}>
        <Text style={styles.resultTitle}>{item.name}</Text>
        <Text style={styles.resultDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
        <View style={styles.searchIconContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
        </View>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Search for places, areas..."
          placeholderTextColor={colors.onSurfaceVariant}
          value={searchQuery}
          onChangeText={handleSearchTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearSearch}
          >
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id}
            style={styles.resultsList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* Loading indicator */}
      {isLoading && searchQuery.length > 0 && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchContainerFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  searchIconContainer: {
    marginRight: spacing.sm,
  },
  searchIcon: {
    fontSize: 16,
    color: colors.onSurfaceVariant,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.onSurface,
    paddingVertical: spacing.xs,
  },
  clearButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  clearIcon: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    fontWeight: 'bold',
  },
  resultsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
    ...shadows.lg,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 300,
  },
  resultsList: {
    maxHeight: 300,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  resultIconContainer: {
    marginRight: spacing.sm,
  },
  resultIcon: {
    fontSize: 18,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: spacing.xs / 2,
  },
  resultDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.onSurfaceVariant,
  },
  loadingContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
    padding: spacing.md,
    ...shadows.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingText: {
    fontSize: typography.fontSize.sm,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
});

export default SearchBar;