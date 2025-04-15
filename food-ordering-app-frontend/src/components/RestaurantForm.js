import React, { useState } from 'react';
import { restaurantApi } from '../services/api';

const RestaurantForm = () => {
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    cuisine: '',
    address: '',
    isAvailable: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await restaurantApi.createRestaurant(restaurantData);
      alert('Restaurant created successfully!');
      setRestaurantData({ name: '', cuisine: '', address: '', isAvailable: true });
    } catch (error) {
      alert('Failed to create restaurant: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="restaurant-form">
      <h2>Add New Restaurant</h2>
      <input
        placeholder="Restaurant Name"
        value={restaurantData.name}
        onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
      />
      <input
        placeholder="Cuisine Type"
        value={restaurantData.cuisine}
        onChange={(e) => setRestaurantData({ ...restaurantData, cuisine: e.target.value })}
      />
      <textarea
        placeholder="Address"
        value={restaurantData.address}
        onChange={(e) => setRestaurantData({ ...restaurantData, address: e.target.value })}
      />
      <button type="submit">Create Restaurant</button>
    </form>
  );
};

export default RestaurantForm;
