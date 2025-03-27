// restaurant-service/index.js
const express = require('express');
const app = express();
app.use(express.json());

let restaurants = ['colombo-cafe', 'pizza-hut', 'kfc'];

app.get('/restaurants', (req, res) => {
  res.json(restaurants);
});

app.post('/restaurants', (req, res) => {
  const restaurant = req.body;
  restaurants.push(restaurant);
  res.status(201).send('Restaurant created');
});

app.get('/health', (req, res) => res.send('OK'));

app.listen(3001, () => console.log('Restaurant service running on port 3001'));