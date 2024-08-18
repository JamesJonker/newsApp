const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const cors = require('cors');



const bcrypt = require('bcrypt');
const saltRounds = 10;  // Defines the cost factor

const password = '';

const app = express();
const PORT = 3000;
const DB_PATH = './myDB.db';

app.use(cors());

// Check if the SQLite database exists
if (!fs.existsSync(DB_PATH)) {
    console.log('Database does not exist. Creating database...');

    // Create and initialize the database
    const db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('Error creating database:', err.message);
        } else {
            console.log('Database created successfully.');

            // Create a table if it doesn't exist
            db.run(`
                CREATE TABLE users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL,
                    password TEXT NOT NULL
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating table:', err.message);
                } else {
                    console.log('Users table created successfully.');
                }
            });

            db.run(`
                CREATE TABLE IF NOT EXISTS news (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  title TEXT NOT NULL,
                  description TEXT NOT NULL,
                  content TEXT NOT NULL,
                  publishedAt TEXT NOT NULL
                )
              `, (err) => {
                if (err) {
                  console.error('Error creating table', err);
                } else {
                  console.log('Table "news" created or already exists');
                }
              });
        }
    });

    db.close();
} else {
    console.log('Database already exists.');
}


let sql;

// Middleware
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Route to handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Database error' });
        } else if (row) {
            bcrypt.compare(password, row.password, (err, result) => {
                if (err) {
                    res.status(500).json({ success: false, message: 'Error comparing passwords' });
                } else if (result) {
                    res.json({ success: true, message: 'Login successful' });
                } else {
                    res.status(401).json({ success: false, message: 'Invalid credentials' });
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

// Route to register a new user
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error hashing password' });
        } else {
            db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function(err) {
                if (err) {
                    res.status(500).json({ success: false, message: 'Database error' });
                } else {
                    res.json({ success: true, message: 'User registered', userId: this.lastID });
                }
            });
        }
    });
});

app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Database error', error: err.message });
        } else {
            res.json({ success: true, data: rows });
        }
    });
});



//////////News ///
app.post('/news', (req, res) => {
    const { title, description, content, publishedAt } = req.body;
    const query = 'INSERT INTO news (title, description, content, publishedAt) VALUES (?, ?, ?, ?)';
    db.run(query, [title, description, content, publishedAt], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      console.log(res);
      res.status(201).json({ id: this.lastID });
    });
  });
  
  // Get all articles
  app.get('/news', (req, res) => {
    const query = 'SELECT * FROM news';
    db.all(query, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });
  
  // Get an article by ID
  app.get('/news/:id', (req, res) => {
    const query = 'SELECT * FROM news WHERE id = ?';
    db.get(query, [req.params.id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
    });
  });
  
  // Update an article
  app.put('/news/:id', (req, res) => {
    const { title,description, content, publishedAt } = req.body;
    const query = 'UPDATE news SET title = ?, description = ?, content = ?, publishedAt = ? WHERE id = ?';
    db.run(query, [title, description, content, publishedAt, req.params.id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Article not found' });
      }
      res.json({ message: 'Article updated successfully' });
    });
  });
  
  // Delete an article
  app.delete('/news/:id', (req, res) => {
    const query = 'DELETE FROM news WHERE id = ?';
    db.run(query, [req.params.id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Article not found' });
      }
      res.json({ message: 'Article deleted successfully' });
    });
  });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});