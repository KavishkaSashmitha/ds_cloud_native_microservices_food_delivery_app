import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RestaurantList from './components/RestaurantList';
import RestaurantForm from './components/RestaurantForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <Link to="/">Restaurants</Link>
          <Link to="/add-restaurant">Add Restaurant</Link>
        </nav>

        <Routes>
          <Route path="/" element={<RestaurantList />} />
          <Route path="/add-restaurant" element={<RestaurantForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
