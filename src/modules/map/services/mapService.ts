import { MapPin, MapRegion, MapFilters, SearchLocation, PostDetails } from '../../../types/mapTypes';

class MapService {
  
  // Mock data for demonstration
  private mockPins: MapPin[] = [
    {
      id: '1',
      latitude: 12.9716,
      longitude: 77.5946,
      type: 'flat',
      ageInDays: 2,
      color: '#3F51B5', // Will be overridden by VIBGYOR calculation
      title: '2BHK Apartment in Koramangala',
      description: 'Spacious 2BHK with all amenities',
      userId: 'user1',
      createdAt: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: '2',
      latitude: 12.9716,
      longitude: 77.5956,
      type: 'flatmate',
      ageInDays: 5,
      color: '#2196F3',
      title: 'Looking for Female Flatmate',
      description: 'Professional working woman preferred',
      userId: 'user2',
      createdAt: Date.now() - (5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      id: '3',
      latitude: 12.9726,
      longitude: 77.5936,
      type: 'review',
      ageInDays: 1,
      color: '#9C27B0',
      title: 'Review: XYZ Apartment Complex',
      description: 'Great location but poor maintenance',
      userId: 'user3',
      createdAt: Date.now() - (1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: '4',
      latitude: 12.9706,
      longitude: 77.5966,
      type: 'sell',
      ageInDays: 15,
      color: '#4CAF50',
      title: 'Selling Furniture',
      description: 'Moving out sale - bed, sofa, dining table',
      userId: 'user4',
      createdAt: Date.now() - (15 * 24 * 60 * 60 * 1000), // 15 days ago
    },
    {
      id: '5',
      latitude: 12.9736,
      longitude: 77.5976,
      type: 'flat',
      ageInDays: 45,
      color: '#FF9800',
      title: '1BHK Studio Apartment',
      description: 'Fully furnished studio near metro',
      userId: 'user5',
      createdAt: Date.now() - (45 * 24 * 60 * 60 * 1000), // 45 days ago
    },
  ];

  private mockSearchResults: SearchLocation[] = [
    {
      id: 'koramangala',
      name: 'Koramangala',
      description: 'Popular residential area in Bangalore',
      latitude: 12.9279,
      longitude: 77.6271,
      type: 'area',
    },
    {
      id: 'indiranagar',
      name: 'Indiranagar',
      description: 'Vibrant neighborhood with restaurants and pubs',
      latitude: 12.9719,
      longitude: 77.6412,
      type: 'area',
    },
    {
      id: 'btm-layout',
      name: 'BTM Layout',
      description: 'Residential area with good connectivity',
      latitude: 12.9166,
      longitude: 77.6101,
      type: 'area',
    },
    {
      id: 'electronic-city',
      name: 'Electronic City',
      description: 'IT hub with many tech companies',
      latitude: 12.8456,
      longitude: 77.6603,
      type: 'area',
    },
  ];

  // Get pins in a specific region with filters
  async getPinsInRegion(region: MapRegion, filters: MapFilters): Promise<MapPin[]> {
    // Simulate API delay
    await this.delay(800);

    // Filter pins based on the region and filters
    let filteredPins = this.mockPins.filter(pin => {
      // Check if pin is within the region bounds
      const isInRegion = 
        pin.latitude >= region.latitude - region.latitudeDelta / 2 &&
        pin.latitude <= region.latitude + region.latitudeDelta / 2 &&
        pin.longitude >= region.longitude - region.longitudeDelta / 2 &&
        pin.longitude <= region.longitude + region.longitudeDelta / 2;

      // Check if pin type is in selected filters
      const isTypeSelected = filters.postTypes.includes(pin.type);

      // Check if pin age is within filter range
      const isAgeInRange = pin.ageInDays <= filters.ageRange;

      return isInRegion && isTypeSelected && isAgeInRange;
    });

    // Sort pins based on selected sort option
    filteredPins = this.sortPins(filteredPins, filters.sortBy, region);

    return filteredPins;
  }

  // Search for locations
  async searchLocations(query: string): Promise<SearchLocation[]> {
    await this.delay(300);

    const lowercaseQuery = query.toLowerCase();
    return this.mockSearchResults.filter(location =>
      location.name.toLowerCase().includes(lowercaseQuery) ||
      location.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get current user location (mock implementation)
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      // In a real app, use react-native-geolocation-service
      // navigator.geolocation.getCurrentPosition(
      //   (position) => {
      //     resolve({
      //       latitude: position.coords.latitude,
      //       longitude: position.coords.longitude,
      //     });
      //   },
      //   (error) => {
      //     reject(error);
      //   },
      //   { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      // );

      // For now, return default Bangalore location
      setTimeout(() => {
        resolve({
          latitude: 12.9716,
          longitude: 77.5946,
        });
      }, 1000);
    });
  }

  // Create a new post
  async createPost(postData: PostDetails): Promise<MapPin> {
    await this.delay(1000);

    // Calculate age in days (new post = 0 days)
    const ageInDays = 0;

    const newPin: MapPin = {
      id: `pin_${Date.now()}`,
      latitude: postData.location.latitude,
      longitude: postData.location.longitude,
      type: postData.type,
      ageInDays,
      color: '', // Will be set by reducer with VIBGYOR color
      title: postData.title,
      description: postData.description,
      userId: postData.userId,
      createdAt: Date.now(),
    };

    // Add to mock data for future queries
    this.mockPins.push(newPin);

    return newPin;
  }

  // Get pin details by ID
  async getPinDetails(pinId: string): Promise<PostDetails | null> {
    await this.delay(300);

    const pin = this.mockPins.find(p => p.id === pinId);
    if (!pin) return null;

    // Convert pin to full post details (mock data)
    const postDetails: PostDetails = {
      id: pin.id,
      type: pin.type,
      title: pin.title,
      description: pin.description,
      location: {
        latitude: pin.latitude,
        longitude: pin.longitude,
        address: 'Sample Address, Bangalore', // Mock address
      },
      price: this.getMockPrice(pin.type),
      contactInfo: {
        phone: '+91 9876543210',
        email: 'contact@example.com',
      },
      amenities: this.getMockAmenities(pin.type),
      createdAt: pin.createdAt,
      userId: pin.userId,
    };

    return postDetails;
  }

  // Utility methods
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private sortPins(pins: MapPin[], sortBy: string, region: MapRegion): MapPin[] {
    switch (sortBy) {
      case 'distance':
        return pins.sort((a, b) => {
          const distanceA = this.calculateDistance(region.latitude, region.longitude, a.latitude, a.longitude);
          const distanceB = this.calculateDistance(region.latitude, region.longitude, b.latitude, b.longitude);
          return distanceA - distanceB;
        });
      case 'date':
        return pins.sort((a, b) => b.createdAt - a.createdAt);
      default:
        return pins;
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in kilometers
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private getMockPrice(type: string): number {
    switch (type) {
      case 'flat':
        return Math.floor(Math.random() * 30000) + 10000; // 10k-40k
      case 'flatmate':
        return Math.floor(Math.random() * 15000) + 5000; // 5k-20k
      case 'sell':
        return Math.floor(Math.random() * 50000) + 1000; // 1k-51k
      default:
        return 0;
    }
  }

  private getMockAmenities(type: string): string[] {
    const commonAmenities = ['WiFi', 'Power Backup', 'Security'];
    const flatAmenities = ['Parking', 'Gym', 'Swimming Pool', 'Elevator'];
    const sellAmenities = ['Good Condition', 'Home Delivery', 'Negotiable'];

    switch (type) {
      case 'flat':
      case 'flatmate':
        return [...commonAmenities, ...flatAmenities];
      case 'sell':
        return [...commonAmenities, ...sellAmenities];
      default:
        return commonAmenities;
    }
  }
}

export const mapService = new MapService();