const express = require('express');
const mysql = require('mysql2');
const http = require('http');
const bcrypt = require('bcrypt');
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
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dbsafestreets',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
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
