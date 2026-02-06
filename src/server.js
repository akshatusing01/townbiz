'use strict';

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/townbiz', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the TownBiz API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
