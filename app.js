const express = require('express')
const app = express()

app.use(express.json())

const index_routes = require('./routes/index');
const userRoutes = require('./routes/users');

app.use('/', index_routes);
app.use('/v1/user', userRoutes);

module.exports = app;