'use strict';

const express = require('express');
const mongoose = require('mongoose');



// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// Connect to the database
mongoose.connect('mongodb://192.168.1.23:30000/users', {
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
    uniqu: true,
  },
});

// Create a model for the User schema
const User = mongoose.model('User', userSchema);

// App
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Route to test the server
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/users', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

app.post('/users', async (req, res, next) => {
  try {
    const user = new User(req.body);
    const result = await user.save();
    res.json(result);
  } catch (error) {
    next(error);
  }
});


// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route to serve the HTML form
app.get('/create-user', (req, res) => {
  res.sendFile('create-user.html', { root: __dirname + '/' });
});





app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
