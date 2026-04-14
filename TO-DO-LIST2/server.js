const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// Session Configuration
app.use(session({
  secret: 'super-secret-key-123',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Global variables for templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/', indexRoutes);

// Error Handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
