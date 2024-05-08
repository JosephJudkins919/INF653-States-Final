// Pull in environment variables
require('dotenv').config();

// Import required modules
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = require('./config/dbConnection.js');
connectDB();

// Apply Cross-Origin Resource Sharing (CORS)
app.use(cors(corsOptions));

// Define the port number
const PORT = process.env.PORT || 3300;

// Parse incoming request bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files from the 'public' directory
app.use('/', express.static(path.join(__dirname, '/public')));

// Define routes
app.use('/', require('./routes/root'));
app.use('/states', require('./routes/api/states'));

// Handle 404 errors
app.all('*', (req, res) => {
  // Send a 404 status code
  res.status(404);

  // Send an appropriate response based on the client's accept header
  if (req.accepts('html')) {
    // Send an HTML response
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    // Send a JSON response
    res.json({ err: '404 Not Found' });
  } else {
    // Send a plain text response
    res.type('txt').send('404 Not Found');
  }
});

// Start the server
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
