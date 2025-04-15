import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const restaurantApi = {
  searchRestaurants: async (query) => {
    const response = await axios.get(`${API_BASE_URL}/restaurants/search`, { params: query });
    return response.data;
  },

  createRestaurant: async (restaurantData) => {
    const response = await axios.post(`${API_BASE_URL}/restaurants`, restaurantData);
    return response.data;
  },

  addMenuItem: async (restaurantId, menuItem) => {
    const response = await axios.post(`${API_BASE_URL}/restaurants/${restaurantId}/menu-items`, menuItem);
    return response.data;
  }
};
