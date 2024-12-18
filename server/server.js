const express = require('express');
const mysql = require('mysql2');
const http = require('http');
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


const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbsafestreets'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database!');
});

// POST route for user registration
app.post('/register', (req, res) => {
    const { firstName, middleName,  lastName, contact, password, birthdate, gender, username } = req.body;

    // Insert into 'users' table
    const userSql = 'INSERT INTO tblaccount (username, password) VALUES (?, ?)';
    db.query(userSql, [username, password], (err, userResult) => {
        if (err) {
            console.error('Error inserting into users:', err);
            return res.status(500).json({ error: 'Failed to register user.' });
        }

        const userId = userResult.insertId; // Get generated user_id

        // Insert into 'user_profiles' table
        const profileSql = `
            INSERT INTO tbl_information (user_id, first_name, middle_name, last_name, birthday, contact)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(profileSql, [userId, firstName, lastName, contact, birthdate, gender], (err) => {
            if (err) {
                console.error('Error inserting into user_profiles:', err);
                return res.status(500).json({ error: 'Failed to save user profile.' });
            }

            res.status(201).json({ message: 'User registered successfully!' });
        });
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
