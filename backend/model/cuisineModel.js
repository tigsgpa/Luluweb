const express = require('express');
const mongoose = require('mongoose');
const Restaurant = require('./models/restaurant'); // Assuming you have the Restaurant model

const app = express();

// Middleware to parse JSON requests
app.use(express.json()); 

// Route to fetch distinct cuisine types
app.get('/cuisines', async (req, res) => {
  try {
    const cuisines = await Restaurant.distinct('cuisine');
    res.json({ data: cuisines });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cuisines' });
  }
});

// Route to fetch restaurants by cuisine
app.get('/restaurants-by-cuisine', async (req, res) => {
  const cuisineQuery = req.query.cuisine;
  try {
    const restaurants = await Restaurant.find({ cuisine: cuisineQuery });
    res.json({ data: restaurants });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// Route to search restaurants by item name or tag
app.get('/search-cuisine', async (req, res) => {
  const searchQuery = req.query.q; // Get the search query from the URL
  try {
    const restaurants = await Restaurant.find({
      $or: [
        { 'items.name': { $regex: searchQuery, $options: 'i' } },
        { 'items.tag': { $regex: searchQuery, $options: 'i' } },
      ],
    });
    res.json({ data: restaurants });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
