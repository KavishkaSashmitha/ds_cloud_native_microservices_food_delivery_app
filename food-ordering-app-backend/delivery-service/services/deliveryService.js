const { logger } = require('../config/logger');

// Temporary in-memory storage (replace with actual DB)
const profiles = new Map();
const deliveries = new Map();

const deliveryService = {
  // Profile Management
  getProfile: async (userId) => {
    try {
      logger.debug(`Getting profile for user: ${userId}`);
      
      // Simulate database lookup
      if (!profiles.has(userId)) {
        // Create a default profile if not exists
        const defaultProfile = {
          userId: userId,
          name: 'Delivery Partner',
          phone: '123-456-7890',
          vehicleType: 'Motorcycle',
          vehicleNumber: 'AB-1234',
          isAvailable: true,
          rating: 4.5,
          completedDeliveries: 0,
          location: { lat: 0, lng: 0 },
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        profiles.set(userId, defaultProfile);
      }
      
      return profiles.get(userId);
    } catch (error) {
      logger.error(`Error getting profile: ${error.message}`);
      throw error;
    }
  },
  
  updateProfile: async (userId, profileData) => {
    try {
      logger.debug(`Updating profile for user: ${userId}`);
      
      // Get existing profile or create new one
      const existingProfile = profiles.has(userId) 
        ? profiles.get(userId) 
        : { userId, createdAt: new Date() };
      
      // Update with new data
      const updatedProfile = {
        ...existingProfile,
        ...profileData,
        updatedAt: new Date()
      };
      
      profiles.set(userId, updatedProfile);
      return updatedProfile;
    } catch (error) {
      logger.error(`Error updating profile: ${error.message}`);
      throw error;
    }
  },
  
  updateAvailability: async (userId, isAvailable) => {
    try {
      logger.debug(`Updating availability for user: ${userId} to ${isAvailable}`);
      
      const profile = await this.getProfile(userId);
      profile.isAvailable = isAvailable;
      profile.updatedAt = new Date();
      
      profiles.set(userId, profile);
      return profile;
    } catch (error) {
      logger.error(`Error updating availability: ${error.message}`);
      throw error;
    }
  },
  
  // Delivery Management (simplified implementations)
  getAvailableDeliveries: async () => {
    return Array.from(deliveries.values()).filter(d => d.status === 'PENDING');
  },
  
  getNearbyDeliveries: async (lat, lng, radius) => {
    // Simple implementation for now
    return Array.from(deliveries.values()).filter(d => d.status === 'PENDING');
  },
  
  getActiveDeliveries: async (userId) => {
    return Array.from(deliveries.values()).filter(
      d => d.deliveryPersonId === userId && 
           ['ACCEPTED', 'PICKED_UP', 'ON_THE_WAY'].includes(d.status)
    );
  },
  
  acceptDelivery: async (deliveryId, userId) => {
    const delivery = deliveries.get(deliveryId);
    if (!delivery) throw new Error('Delivery not found');
    if (delivery.status !== 'PENDING') throw new Error('Delivery already assigned');
    
    delivery.deliveryPersonId = userId;
    delivery.status = 'ACCEPTED';
    delivery.acceptedAt = new Date();
    
    deliveries.set(deliveryId, delivery);
    return delivery;
  },
  
  updateDeliveryStatus: async (deliveryId, userId, status, location) => {
    const delivery = deliveries.get(deliveryId);
    if (!delivery) throw new Error('Delivery not found');
    if (delivery.deliveryPersonId !== userId) throw new Error('Not authorized to update this delivery');
    
    delivery.status = status;
    delivery.updatedAt = new Date();
    if (location) {
      delivery.currentLocation = location;
    }
    
    if (status === 'PICKED_UP') {
      delivery.pickedUpAt = new Date();
    }
    
    deliveries.set(deliveryId, delivery);
    return delivery;
  },
  
  completeDelivery: async (deliveryId, userId) => {
    const delivery = deliveries.get(deliveryId);
    if (!delivery) throw new Error('Delivery not found');
    if (delivery.deliveryPersonId !== userId) throw new Error('Not authorized to update this delivery');
    
    delivery.status = 'DELIVERED';
    delivery.deliveredAt = new Date();
    deliveries.set(deliveryId, delivery);
    
    // Update the delivery person's completed deliveries count
    const profile = profiles.get(userId);
    if (profile) {
      profile.completedDeliveries = (profile.completedDeliveries || 0) + 1;
      profiles.set(userId, profile);
    }
    
    return delivery;
  },
  
  // History and Stats
  getDeliveryHistory: async (userId, page = 1, limit = 10) => {
    const userDeliveries = Array.from(deliveries.values())
      .filter(d => d.deliveryPersonId === userId && d.status === 'DELIVERED')
      .sort((a, b) => new Date(b.deliveredAt) - new Date(a.deliveredAt));
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const deliveriesPage = userDeliveries.slice(start, end);
    
    return {
      deliveries: deliveriesPage,
      page: page,
      totalPages: Math.ceil(userDeliveries.length / limit),
      totalDeliveries: userDeliveries.length
    };
  },
  
  getDeliveryStats: async (userId, period = 'week') => {
    // Simplified stats
    const profile = profiles.get(userId) || { completedDeliveries: 0 };
    
    return {
      completedDeliveries: profile.completedDeliveries || 0,
      period: period,
      earnings: profile.completedDeliveries * 5.00, // $5 per delivery
      rating: profile.rating || 4.5
    };
  },
  
  getEarningsReport: async (userId, startDate, endDate) => {
    const completedDeliveries = Array.from(deliveries.values())
      .filter(d => d.deliveryPersonId === userId && d.status === 'DELIVERED');
    
    // Simplified earnings calculation
    return {
      totalEarnings: completedDeliveries.length * 5.00,
      deliveryCount: completedDeliveries.length,
      periodStart: startDate || 'all-time',
      periodEnd: endDate || 'all-time'
    };
  },
  
  // Location Management
  updateCurrentLocation: async (userId, location) => {
    const profile = await this.getProfile(userId);
    profile.location = location;
    profile.updatedAt = new Date();
    
    profiles.set(userId, profile);
    return profile;
  },
  
  getDeliveryRoute: async (deliveryId, userId) => {
    const delivery = deliveries.get(deliveryId);
    if (!delivery) throw new Error('Delivery not found');
    if (delivery.deliveryPersonId !== userId) throw new Error('Not authorized to access this delivery');
    
    // Simplified route info
    return {
      start: delivery.restaurantLocation,
      end: delivery.deliveryLocation,
      currentLocation: delivery.currentLocation
    };
  }
};

module.exports = deliveryService;