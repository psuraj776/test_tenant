import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MapState, MapPin, MapRegion, MapFilters, SearchLocation } from '../../../types/mapTypes';
import { getVibgyorColor } from '../../../theme';
import { mapService } from '../services/mapService.js';

// Initial state with default location (Bangalore, India)
const initialState: MapState = {
  region: {
    latitude: 12.9716,
    longitude: 77.5946,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  pins: [],
  selectedPin: null,
  filters: {
    postTypes: ['review', 'flat', 'flatmate', 'sell'],
    ageRange: 365, // 1 year
    radius: 10, // 10 km
    sortBy: 'distance',
  },
  searchQuery: '',
  searchResults: [],
  isLoading: false,
  error: null,
  userLocation: null,
};

// Async thunks
export const loadMapPins = createAsyncThunk(
  'map/loadMapPins',
  async (region: MapRegion, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { map: MapState };
      const pins = await mapService.getPinsInRegion(region, state.map.filters);
      
      // Add VIBGYOR colors based on age
      const pinsWithColors = pins.map((pin: MapPin) => ({
        ...pin,
        color: getVibgyorColor(pin.ageInDays),
      }));
      
      return pinsWithColors;
    } catch (error) {
      return rejectWithValue('Failed to load map pins');
    }
  }
);

export const searchLocation = createAsyncThunk(
  'map/searchLocation',
  async (query: string, { rejectWithValue }) => {
    try {
      if (!query.trim()) {
        return [];
      }
      const results = await mapService.searchLocations(query);
      return results;
    } catch (error) {
      return rejectWithValue('Failed to search locations');
    }
  }
);

export const getUserLocation = createAsyncThunk(
  'map/getUserLocation',
  async (_, { rejectWithValue }) => {
    try {
      const location = await mapService.getCurrentLocation();
      return location;
    } catch (error) {
      return rejectWithValue('Failed to get user location');
    }
  }
);

export const createNewPost = createAsyncThunk(
  'map/createNewPost',
  async (postData: any, { rejectWithValue }) => {
    try {
      const newPin = await mapService.createPost(postData);
      return {
        ...newPin,
        color: getVibgyorColor(newPin.ageInDays),
      };
    } catch (error) {
      return rejectWithValue('Failed to create post');
    }
  }
);

// Map slice
const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setRegion: (state, action: PayloadAction<MapRegion>) => {
      state.region = action.payload;
    },
    setSelectedPin: (state, action: PayloadAction<MapPin | null>) => {
      state.selectedPin = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<MapFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      if (!action.payload.trim()) {
        state.searchResults = [];
      }
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    clearError: (state) => {
      state.error = null;
    },
    setUserLocation: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      state.userLocation = action.payload;
    },
    // Add a pin to the map (for real-time updates)
    addPin: (state, action: PayloadAction<MapPin>) => {
      const pinWithColor = {
        ...action.payload,
        color: getVibgyorColor(action.payload.ageInDays),
      };
      state.pins.push(pinWithColor);
    },
    // Remove a pin from the map
    removePin: (state, action: PayloadAction<string>) => {
      state.pins = state.pins.filter(pin => pin.id !== action.payload);
    },
    // Update a pin on the map
    updatePin: (state, action: PayloadAction<MapPin>) => {
      const index = state.pins.findIndex(pin => pin.id === action.payload.id);
      if (index !== -1) {
        state.pins[index] = {
          ...action.payload,
          color: getVibgyorColor(action.payload.ageInDays),
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Load map pins
      .addCase(loadMapPins.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadMapPins.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pins = action.payload;
        state.error = null;
      })
      .addCase(loadMapPins.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Search location
      .addCase(searchLocation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Get user location
      .addCase(getUserLocation.fulfilled, (state, action) => {
        state.userLocation = action.payload;
        // Center map on user location
        state.region = {
          ...action.payload,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
      })
      .addCase(getUserLocation.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Create new post
      .addCase(createNewPost.fulfilled, (state, action) => {
        state.pins.push(action.payload);
      })
      .addCase(createNewPost.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setRegion,
  setSelectedPin,
  setFilters,
  setSearchQuery,
  clearSearchResults,
  clearError,
  setUserLocation,
  addPin,
  removePin,
  updatePin,
} = mapSlice.actions;

export default mapSlice.reducer;