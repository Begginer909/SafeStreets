require('dotenv').config(); // Load .env variables

const express = require('express');
const mysql = require('mysql2');
const http = require('http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const bodyParser = require('body-parse');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// Login endpoint (with JWT)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const sql = 'SELECT * FROM tblaccount WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Failed to login.' });
    }

    if (!results.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = { userId: user.id }; // Use user ID for payload
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  });
});

// CRUD Endpoints
app.get('/account', (req, res) => {
  db.query('SELECT * FROM tblaccount', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/register', (req, res) => {
  const { firstName, lastName, contact, password, birthdate, gender, username } = req.body;

  // Insert into 'tbl_information' table
  const profileSql = `
      INSERT INTO tbl_information (firstName, lastName, contact, birthday, gender)
      VALUES (?, ?, ?, ?, ?)
  `;

  db.query(profileSql, [firstName, lastName, contact, birthdate, gender], (err, profileResult) => {
      if (err) {
          console.error('Error inserting into tbl_information:', err);
          return res.status(500).json({ error: 'Failed to save user profile.' });
      }

      const userId = profileResult.insertId; // Get generated user_id from tbl_information

      // Insert into 'tblaccount' table
      const accountSql = 'INSERT INTO tblaccount (userID, username, password) VALUES (?, ?, ?)';

      db.query(accountSql, [userId, username, password], (err) => {
          if (err) {
              console.error('Error inserting into tblaccount:', err);
              return res.status(500).json({ error: 'Failed to register user.' });
          }

          res.status(201).json({ message: 'User registered successfully!' });
      });
  });
});


app.get('/check-username', (req, res) => {
  const { username } = req.query;

  const sql = 'SELECT COUNT(*) AS count FROM tblaccount WHERE username = ?';
  db.query(sql, [username], (err, results) => {
      if (err) {
          console.error('Error checking username:', err);
          return res.status(500).json({ error: 'Failed to check username.' });
      }
      const exists = results[0].count > 0;
      res.json({ exists }); // Return whether the username exists
  });
});



/*
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const sql = 'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?';
  db.query(sql, [title, description, status, id], (err, result) => {
    if (err) throw err;
    io.emit('task_updated', { id, title, description, status }); // Real-time event
    res.json({ message: 'Task updated successfully!' });
  });
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    io.emit('task_deleted', { id }); // Real-time event
    res.json({ message: 'Task deleted successfully!' });
  });
});
*/

// Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
