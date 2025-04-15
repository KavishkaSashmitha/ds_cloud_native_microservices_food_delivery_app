import React, { useState, useEffect } from 'react';
import { restaurantApi } from '../services/api';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState({ cuisine: '', name: '' });

  const handleSearch = async () => {
    try {
      const { restaurants } = await restaurantApi.searchRestaurants(searchQuery);
      setRestaurants(restaurants);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    }
  };

  return (
    <div className="restaurant-list">
      <div className="search-controls">
        <input
          placeholder="Restaurant name"
          onChange={(e) => setSearchQuery({ ...searchQuery, name: e.target.value })}
        />
        <input
          placeholder="Cuisine type"
          onChange={(e) => setSearchQuery({ ...searchQuery, cuisine: e.target.value })}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="restaurants-grid">
        {restaurants.map((restaurant) => (
          <div key={restaurant._id} className="restaurant-card">
            <h3>{restaurant.name}</h3>
            <p>{restaurant.cuisine}</p>
            <div className="menu-items">
              {restaurant.menuItems.map((item, index) => (
                <div key={index} className="menu-item">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
