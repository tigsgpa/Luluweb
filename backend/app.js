const express = require('express');
const app = new express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 8080;

const Restaurant = require('./model/restaurantModel'); // Import the Mongoose model
const BugReport = require('./model/BugReport'); // Import the BugReport Mongoose model

require('./connection'); // Assuming you have MongoDB connection here

app.use(express.json());
app.use(cors());
app.use(bodyParser.json()); // Parse JSON request bodies

// Add route to handle search requests
app.get('/search-cuisine', async (req, res) => {
  const query = req.query.q ? req.query.q.toLowerCase() : '';

  try {
    // Fetch all restaurants from the database
    const restaurants = await Restaurant.find();

    // Filter restaurants based on shop_name only
    const filteredRestaurants = restaurants.filter(restaurant => {
      return restaurant.shop_name?.toLowerCase().includes(query);
    });

    // Send the response based on the filtering
    if (filteredRestaurants.length > 0) {
      res.status(200).json({ success: true, data: filteredRestaurants });
    } else {
      res.status(404).json({ success: false, message: 'No restaurants found' });
    }
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add route to handle fetching a restaurant by _id
app.get('/restaurant/:id', async (req, res) => {
  const { id } = req.params; // Get the restaurant ID from the URL

  try {
    // Find the restaurant by its _id
    const restaurant = await Restaurant.findById(id);

    if (restaurant) {
      res.status(200).json({ success: true, data: restaurant });
    } else {
      res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Route to handle bug report submission
app.post('/api/report-bug', async (req, res) => {
  const { name, email, bugType, description } = req.body;

  // Simple validation
  if (!name || !email || !bugType || !description) {
    return res.status(400).json({ status: 'error', message: 'All fields are required.' });
  }

  // Create a new bug report instance
  const newBugReport = new BugReport({
    name,
    email,
    bugType,
    description,
  });

  try {
    // Save the bug report to the database
    await newBugReport.save();
    // Respond with success
    return res.json({ status: 'success', message: 'Bug reported successfully!' });
  } catch (error) {
    console.error('Error saving to database:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to report the bug.' });
  }
});

// Optional: Route to retrieve bug reports (for testing)
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await BugReport.find(); // Fetch all reports from the database
    res.json({ success: true, data: reports });
  } catch (error) {
    console.error('Error retrieving reports:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve reports.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
