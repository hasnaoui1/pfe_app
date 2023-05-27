'use strict';

const express = require('express');
const mongoose = require('mongoose');

const PORT = 3000;
const HOST = '0.0.0.0';

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
        html += `<td>${user.name}</td>`;
        html += `<td>${user.email}</td>`;
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
