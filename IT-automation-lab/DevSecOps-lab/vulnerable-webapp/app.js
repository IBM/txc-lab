const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// VULNERABILITY: Hardcoded credentials
const adminCredentials = {
  username: 'admin',
  password: 'admin123'
};

// VULNERABILITY: API key exposed in code
const apiKey = 'sk_test_51HdgUlDKj5DgfKjdkfJKDjfkdjfkdjkfjdkfjdk';

// Database setup
const dbFile = path.join(__dirname, 'database.db');
const dbExists = fs.existsSync(dbFile);
const db = new sqlite3.Database(dbFile);

// Initialize database
if (!dbExists) {
  db.serialize(() => {
    // Create users table
    db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, email TEXT)');
    
    // Insert sample users
    db.run("INSERT INTO users (username, password, email) VALUES ('admin', 'admin123', 'admin@example.com')");
    db.run("INSERT INTO users (username, password, email) VALUES ('user1', 'password123', 'user1@example.com')");
    
    // Create messages table
    db.run('CREATE TABLE messages (id INTEGER PRIMARY KEY, user_id INTEGER, message TEXT, created_at TEXT)');
    
    // Insert sample messages
    db.run("INSERT INTO messages (user_id, message, created_at) VALUES (1, 'Welcome to our vulnerable app!', datetime('now'))");
  });
}

// Routes
app.get('/', (req, res) => {
  res.render('index', { message: null });
});

// VULNERABILITY: SQL Injection in login query
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // VULNERABILITY: Direct string concatenation in SQL query
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  db.get(query, (err, user) => {
    if (err) {
      return res.render('index', { message: 'Database error occurred' });
    }
    
    if (user) {
      // VULNERABILITY: Insecure cookie (no httpOnly, no secure flag)
      res.cookie('user_id', user.id);
      res.cookie('username', user.username);
      
      return res.redirect('/dashboard');
    } else {
      return res.render('index', { message: 'Invalid username or password' });
    }
  });
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  const userId = req.cookies.user_id;
  const username = req.cookies.username;
  
  if (!userId) {
    return res.redirect('/');
  }
  
  // VULNERABILITY: SQL Injection in messages query
  db.all(`SELECT * FROM messages WHERE user_id = ${userId} OR user_id = 1`, (err, messages) => {
    if (err) {
      return res.render('dashboard', { username, messages: [] });
    }
    
    return res.render('dashboard', { username, messages });
  });
});

// VULNERABILITY: XSS vulnerability (unescaped user input)
app.post('/messages', (req, res) => {
  const userId = req.cookies.user_id;
  const message = req.body.message;
  
  if (!userId) {
    return res.redirect('/');
  }
  
  // VULNERABILITY: No input validation
  db.run(
    'INSERT INTO messages (user_id, message, created_at) VALUES (?, ?, datetime("now"))',
    [userId, message],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save message' });
      }
      
      return res.redirect('/dashboard');
    }
  );
});

// VULNERABILITY: Information disclosure in error messages
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`Server Error: ${err.message}\n${err.stack}`);
});

// Start server
app.listen(port, () => {
  console.log(`Vulnerable app listening at http://localhost:${port}`);
});

// Made with Bob
