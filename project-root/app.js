require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const expressLayouts = require('express-ejs-layouts');


const sessionConfig = require('./config/session');

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const supplierRoutes = require('./routes/suppliers');
const productRoutes = require('./routes/products');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout'); // layout.ejs trong thư mục views


// DB connect
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session(sessionConfig));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// Make user available in views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// Routes
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/products', productRoutes);

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Swagger setup
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Supplier & Product API',
    version: '1.0.0',
    description: 'API documentation for Supplier & Product management'
  },
  servers: [
    { url: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}` }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js', './controllers/*.js', './models/*.js']
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start
const port = process.env.PORT || 3000;
app.listen(port, ()=> {
  console.log(`Server started at http://localhost:${port}`);
  console.log(`Swagger UI: http://localhost:${port}/api-docs`);
});
