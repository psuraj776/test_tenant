// Additional types for map functionality

export interface MapPin {
  id: string;
  latitude: number;
  longitude: number;
  type: PostType;
  ageInDays: number;
  color: string; // VIBGYOR based on age
  title: string;
  description: string;
  userId: string;
  createdAt: number;
}

export type PostType = 'review' | 'flat' | 'flatmate' | 'sell';

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface SearchLocation {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  type: 'city' | 'area' | 'landmark' | 'property';
}

export interface MapFilters {
  postTypes: PostType[];
  ageRange: number; // in days
  priceRange?: {
    min: number;
    max: number;
  };
  radius: number; // in kilometers
  sortBy: 'distance' | 'date' | 'price';
}

export interface MapState {
  region: MapRegion;
  pins: MapPin[];
  selectedPin: MapPin | null;
  filters: MapFilters;
  searchQuery: string;
  searchResults: SearchLocation[];
  isLoading: boolean;
  error: string | null;
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

// Post details for creating new posts
export interface PostDetails {
  id?: string;
  type: PostType;
  title: string;
  description: string;
  images?: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  price?: number;
  contactInfo: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
  amenities?: string[];
  preferences?: string[];
  createdAt?: number;
  updatedAt?: number;
  userId: string;
}

// Review specific data
export interface PropertyReview {
  id: string;
  propertyAddress: string;
  propertyType: 'apartment' | 'house' | 'pg' | 'hostel' | 'commercial';
  rating: number; // 1-5
  title: string;
  review: string;
  pros: string[];
  cons: string[];
  images?: string[];
  landlordRating?: number;
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: number;
  userId: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}