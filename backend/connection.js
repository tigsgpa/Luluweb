const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from a .env file if running locally

// Connect to MongoDB using the URI from environment variables
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// Export the mongoose connection to be used in other parts of the app if needed
module.exports = mongoose.connection;
