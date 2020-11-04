require('dotenv').config();
const express = require('express');
const routes = require('./routes/routes')
const exphbs = require('express-handlebars');

const app = express();

// Handlebars config
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'))
app.use('/', routes);

module.exports = app;