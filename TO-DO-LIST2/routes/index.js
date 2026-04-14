const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { requireAuth } = require('../middlewares/auth');

// Apply requireAuth middleware to all routes in this file
router.use(requireAuth);

// Get all Todos
router.get('/', (req, res, next) => {
  try {
    const todos = db.getTodos(req.session.userId);
    res.render('pages/todos', {
      title: 'My To-Do List',
      todos,
      user: req.session.user
    });
  } catch (error) {
    next(error);
  }
});

// Add a new Todo
router.post('/add', (req, res, next) => {
  try {
    const { text } = req.body;
    if (text && text.trim().length > 0) {
      db.addTodo(req.session.userId, text.trim());
    }
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

// Toggle Todo status
router.post('/toggle/:id', (req, res, next) => {
  try {
    db.toggleTodo(req.session.userId, req.params.id);
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

// Delete a Todo
router.post('/delete/:id', (req, res, next) => {
  try {
    db.deleteTodo(req.session.userId, req.params.id);
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
