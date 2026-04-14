const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { preventLoggedInAccess } = require('../middlewares/auth');

// Register View
router.get('/register', preventLoggedInAccess, (req, res) => {
  res.render('pages/register', { title: 'Register', error: null, user: null });
});

// Register Action
router.post('/register', preventLoggedInAccess, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.render('pages/register', { title: 'Register', error: 'Username and password are required', user: null });
    }
    
    await db.createUser(username, password);
    res.redirect('/auth/login');
  } catch (error) {
    if (error.message === 'Username already exists') {
      return res.render('pages/register', { title: 'Register', error: error.message, user: null });
    }
    next(error);
  }
});

// Login View
router.get('/login', preventLoggedInAccess, (req, res) => {
  res.render('pages/login', { title: 'Login', error: null, user: null });
});

// Login Action
router.post('/login', preventLoggedInAccess, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.render('pages/login', { title: 'Login', error: 'Username and password are required', user: null });
    }

    const user = await db.verifyUser(username, password);
    if (!user) {
      return res.render('pages/login', { title: 'Login', error: 'Invalid username or password', user: null });
    }

    // Set session
    req.session.userId = user.id;
    req.session.user = { id: user.id, username: user.username };
    
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

// Logout Action
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Error destroying session:', err);
    res.redirect('/auth/login');
  });
});

module.exports = router;
