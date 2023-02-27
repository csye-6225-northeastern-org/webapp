const express = require('express')
const bodyParser = require('body-parser');
const loggerMiddleware = require('./middleware/loggerMiddleware');

const app = express()

app.use(express.json())
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(loggerMiddleware);


const index_routes = require('./routes/index');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/product');


app.use('/', index_routes);
app.use('/v1/user', userRoutes);
app.use('/v1/product', productRoutes);

module.exports = app;