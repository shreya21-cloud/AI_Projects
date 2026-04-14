const bcrypt = require('bcrypt');

// In-memory data store
const users = new Map(); // username -> { id, username, passwordHash }
const todos = new Map(); // userId -> [{ id, text, completed, createdAt }]

let nextUserId = 1;
let nextTodoId = 1;

async function createUser(username, password) {
  if (users.has(username)) {
    throw new Error('Username already exists');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: nextUserId++,
    username,
    passwordHash
  };
  users.set(username, user);
  todos.set(user.id, []);
  return user;
}

async function verifyUser(username, password) {
  const user = users.get(username);
  if (!user) return null;
  const match = await bcrypt.compare(password, user.passwordHash);
  if (match) return user;
  return null;
}

function getUserById(id) {
  for (const user of users.values()) {
    if (user.id === id) return user;
  }
  return null;
}

function getTodos(userId) {
  return todos.get(userId) || [];
}

function addTodo(userId, text) {
  const userTodos = todos.get(userId) || [];
  const newTodo = {
    id: nextTodoId++,
    text,
    completed: false,
    createdAt: new Date().toISOString()
  };
  userTodos.push(newTodo);
  todos.set(userId, userTodos);
  return newTodo;
}

function toggleTodo(userId, todoId) {
  const userTodos = todos.get(userId) || [];
  const todo = userTodos.find(t => t.id === parseInt(todoId, 10));
  if (todo) {
    todo.completed = !todo.completed;
    return true;
  }
  return false;
}

function deleteTodo(userId, todoId) {
  let userTodos = todos.get(userId) || [];
  const initialLength = userTodos.length;
  userTodos = userTodos.filter(t => t.id !== parseInt(todoId, 10));
  todos.set(userId, userTodos);
  return userTodos.length < initialLength;
}

module.exports = {
  createUser,
  verifyUser,
  getUserById,
  getTodos,
  addTodo,
  toggleTodo,
  deleteTodo
};
