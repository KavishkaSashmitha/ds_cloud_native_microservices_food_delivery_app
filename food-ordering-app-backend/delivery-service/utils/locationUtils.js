/**
 * Utility functions for location-based operations
 */

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  
  const R = 6371e3; // Earth's radius in meters
  
  const lat1 = coords1.lat || coords1[1];
  const lon1 = coords1.lng || coords1[0];
  const lat2 = coords2.lat || coords2[1];
  const lon2 = coords2.lng || coords2[0];
  
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  
  // Haversine formula
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
           Math.cos(φ1) * Math.cos(φ2) *
           Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  const distance = R * c; // distance in meters
  return distance;
};

// Find locations within a radius
const findLocationsWithinRadius = (centerCoords, locations, radiusInMeters) => {
  return locations.filter(location => {
    const distance = calculateDistance(centerCoords, location.coordinates);
    return distance <= radiusInMeters;
  });
};

module.exports = {
  calculateDistance,
  findLocationsWithinRadius
};