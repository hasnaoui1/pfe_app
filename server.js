'use strict';

const express = require('express');
const mongoose = require('mongoose');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// Connect to the database
mongoose.connect('mongodb://192.168.1.28:31403/users', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to database');
})
.catch((err) => {
  console.error(err);
  process.exit(1);
});

// Define a schema for a User
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// Create a model for the User schema
const User = mongoose.model('User', userSchema);

// App
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Route to create a new user
app.post('/users', async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});
// Route to test the server
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});
app.get('/users', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});



app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

