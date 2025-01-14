require('dotenv').config(); // Load .env variables

const express = require('express');
const mysql = require('mysql2');
const http = require('http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(cors({
  origin: 'http://localhost',  // Allow requests from localhost (you can specify a specific port if needed)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,  // Allow cookies to be sent with requests
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json()); 

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
  const sql = `
    SELECT tblaccount.*,
           tbl_information.firstName,
           tbl_information.lastName,
           tbl_information.contact,
           tbl_userrole.role
    FROM tblaccount
    INNER JOIN tbl_information ON tblaccount.userID = tbl_information.userID
    INNER JOIN tbl_userrole ON tblaccount.accountID = tbl_userrole.AccID
    WHERE tblaccount.username = ?
  `;

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

    const secretKey = process.env.SECRET_KEY; // Use a secret key from .env
    const payload = { 
        userId: user.userID,
        accID: user.accountID,
        username: user.username,
        Fname: user.firstName,
        Lname: user.lastName,
        contact: user.contact,
        role: user.role
      }; // Use user ID and username for payload
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    // Set the JWT as a cookie
    res.cookie('auth_token', token, {
      httpOnly: true, // Ensures cookie cannot be accessed via JavaScript
      secure: process.env.NODE_ENV, // Send cookie only over HTTPS in production
      maxAge: 3600000, // Cookie expiry (1 hour)
    });

    // Redirect based on role
    switch (user.role) {
      case 'Admin':
        res.json({ message: 'Login successful', token, redirectUrl: '../../pages/Admin/admin.html' });
        break;
      case 'Staff':
        res.json({ message: 'Login successful', token, redirectUrl: '../../pages/Staff/home.html' });
        break;
      case 'User':
      default:
        res.json({ message: 'Login successful', token, redirectUrl: '../../pages/User/home.html' });
    }
  });
});

// CRUD Endpoint to get user accounts by role
app.get('/userAccount/:role', (req, res) => {
    const role = req.params.role;

    const sql = `
      SELECT 
        tblaccount.accountID, 
        tblaccount.username, 
        tbl_information.userID,
        tbl_information.firstName, 
        tbl_information.lastName,
        tbl_information.contact,
        tbl_information.gender,
        tbl_userrole.role
      FROM 
        tblaccount
      INNER JOIN 
        tbl_information 
        ON tbl_information.userID = tblaccount.userID 
      INNER JOIN 
        tbl_userrole 
        ON tblaccount.accountID = tbl_userrole.accID
      WHERE 
        tbl_userrole.role = ?;
    `;

    db.query(sql, [role], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
      } else {
        res.json(results);
      }
    });
});

// Register endpoint (with bcrypt)
app.post('/register', async (req, res) => {
  const { firstName, lastName, contact, password, birthdate, gender, username, role } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

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

    db.query(accountSql, [userId, username, hashedPassword], (err, accountResult) => {
      if (err) {
        console.error('Error inserting into tblaccount:', err);
        return res.status(500).json({ error: 'Failed to register user.' });
      }

      const accountId = accountResult.insertId; // Get the generated accID from tblaccount

        // Default role to "User" if not provided
        const userRole = role || 'User';

        // Insert role into 'tbl_userrole'
        const roleSql = 'INSERT INTO tbl_userrole (accID, role) VALUES (?, ?)';

        db.query(roleSql, [accountId, userRole], (err) => {
          if (err) {
            console.error('Error assigning role:', err);
            return res.status(500).json({ error: 'Failed to assign role to user.' });
          }
        });

      res.status(201).json({ message: 'User registered successfully!' });
    });
  });
});

app.put('/updateAccount/:id', async (req, res) => {
  const { id } = req.params; // userID
  const { username, firstName, lastName, contact, role, password } = req.body; 

  try {
      // Update tbl_information
      await new Promise((resolve, reject) => {

          const sqlInformation = `
                UPDATE tbl_information
                SET firstName = ?, lastName = ?, contact = ?
                WHERE userID = ?
            `;
            db.query(sqlInformation, [firstName, lastName, contact, id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
      });

      // Update tblaccount
      await new Promise((resolve, reject) => {
            const sqlAccount = `
            UPDATE tblaccount
            SET username = ?
            WHERE userID = ?
        `;
        db.query(sqlAccount, [username, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
      });

      // Update tbl_userrole
      await new Promise((resolve, reject) => {
          const sqlUserRole = `
              UPDATE tbl_userrole
              SET role = ?
              WHERE accID = (SELECT accountID FROM tblaccount WHERE userID = ?)
          `;
          db.query(sqlUserRole, [role, id], (err, result) => {
              if (err) return reject(err);
              resolve(result);
          });
      });

      // Update password if provided
      if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          await new Promise((resolve, reject) => {
              const sqlPassword = `
                  UPDATE tblaccount
                  SET password = ?
                  WHERE userID = ?
              `;
              db.query(sqlPassword, [hashedPassword, id], (err, result) => {
                  if (err) return reject(err);
                  resolve(result);
              });
          });
      }

      res.json({ message: 'Account updated successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while updating the account' });
  }
});

// Endpoint to save crime report
app.post('/report', (req, res) => {
  const { accID, crimeType, description, latitude, longitude, street } = req.body;

  // Validate input
  if (!accID || !crimeType || !latitude || !longitude) {
      return res.status(400).json({ message: 'Missing required fields.' });
  }

  // Insert report into tblreport, associating it with the accID from tblaccount
  const query = `
      INSERT INTO tblreport (accountID, crimeType, description, latitude, longitude, street)
      VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [accID, crimeType, description, latitude, longitude, street];

  db.query(query, values, (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error saving report.' });
      }

      const newReport = {
        accID,
        crimeType,
        description,
        latitude,
        longitude,
        street,
    };

    // Emit the new crime report to all connected clients
    io.emit('new_report', newReport);

      res.status(200).json({ message: 'Report saved successfully.' });
  });
});

app.get('/reports', (req, res) => {
  const query = `
      SELECT tblreport.reportID, tblreport.crimeType, tblreport.description, tblreport.latitude, tblreport.longitude, tblreport.street, tblreport.createdAt, 
             tbl_information.firstName, tbl_information.lastName, tbl_information.contact
      FROM tblreport 
      INNER JOIN tblaccount ON tblreport.accountID = tblaccount.accountID
      INNER JOIN tbl_information ON tblaccount.userID = tbl_information.userID
  `;
  
  db.query(query, (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error fetching reports.' });
      }
      res.json(results);
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

// Protected route example
app.get('/protected', (req, res) => {
  const token = req.cookies.auth_token; // Read token from cookies

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const secretKey = process.env.SECRET_KEY; // Use the same secret key
    const decoded = jwt.verify(token, secretKey); // Verify the token
    res.json({ message: 'Access granted', user: decoded });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Role-based Access Control Middleware
function authorizeRoles(...roles) {
  return (req, res, next) => {
    const token = req.cookies.auth_token; // Extract token from cookies

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
      const secretKey = process.env.SECRET_KEY; // Use your secret key
      const decoded = jwt.verify(token, secretKey); // Verify the token

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
      }

      req.user = decoded; // Attach user info to the request for later use
      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
}

// Admin-only route
app.get('/admin/dashboard', authorizeRoles('Admin'), (req, res) => {
  res.json({ message: 'Welcome Admin' });
});

// Staff-only route
app.get('/staff/home', authorizeRoles('Staff'), (req, res) => {
  res.json({ message: 'Welcome Staff' });
});

// User-only route
app.get('/user/home', authorizeRoles('User'), (req, res) => {
  res.json({ message: 'Welcome User' });
});

// Logout endpoint
app.post('/logout', (req, res) => {
  res.clearCookie('auth_token'); // Clear the auth_token cookie
  res.json({ message: 'Logged out successfully' });
});

// Delete Account Function
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  // Assuming there's a foreign key relationship, and deleting from tbl_account will affect other tables.
  // We use the "CASCADE" option in foreign key constraints to delete related records in other tables automatically.
  const deleteSql = 'DELETE FROM tblaccount WHERE userID = ?'; // Adjust this table name as needed
  const deleteInformationSql = 'DELETE FROM tbl_information WHERE userID = ?'; // Example of related table

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: 'Transaction failed to start.' });
    }

    db.query(deleteInformationSql, [id], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ message: 'Error deleting data from tbl_information' });
        });
      }

      // Proceed with deleting from tbl_account
      db.query(deleteSql, [id], (err, result) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ message: 'Error deleting data from tbl_account' });
          });
        }

        // If everything goes fine, commit the transaction
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ message: 'Error committing transaction' });
            });
          }

          // Emit real-time event
          io.emit('task_deleted', { id });
          
          res.json({ message: 'Account and related data deleted successfully!' });
        });
      });
    });
  });
});


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
