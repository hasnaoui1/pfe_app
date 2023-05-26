'use strict';

const express = require('express');
const mongoose = require('mongoose');
const escapeHtml = require('escape-html');

const PORT = 3000;
const HOST = '0.0.0.0';

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    uniqu: true, // Misspelled property name
  },
});

const User = mongoose.model('User', userSchema);

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/create-user', (req, res) => {
  res.sendFile('create-user.html', { root: __dirname + '/' });
});

app.route('/users')
  .get(async (req, res, next) => {
    try {
      const users = await User.find();
      let html = '<html><body>';
      html += '<table>';
      html += '<tr><th>Name</th><th>Email</th></tr>';
      users.forEach((user) => {
        html += '<tr>';
        html += `<td>${escapeHtml(user.name)}</td>`; // Unescaped user input
        html += `<td>${escapeHtml(user.email)}</td>`; // Unescaped user input
        html += '</tr>';
      });
      html += '</table>';
      html += '</body></html>';
      res.send(html);
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const user = new User(req.body);
      const result = await user.save();
      res.redirect('/users'); // Redirect to the /users route after creating the user
    } catch (error) {
      next(error);
    }
  });

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
