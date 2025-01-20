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

const io = new Server(server, {
  cors: {
    origin: 'http://localhost', // Front-end origin
    methods: ['GET', 'POST'], // Allowed methods
    credentials: true, // Allow cookies or authentication headers,
  }
});

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

// Separate Login Endpoint by Role
app.post('/login/:role', async (req, res) => {
  const { role } = req.params; // Get role from the route
  const { username, password } = req.body;

  // Validate role
  if (!['Admin', 'Staff', 'User'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role.' });
  }

  // Query database for user with matching role
  const sql = `
    SELECT tblaccount.*,
           tbl_information.firstName,
           tbl_information.lastName,
           tbl_information.contact,
           tbl_userrole.role
    FROM tblaccount
    INNER JOIN tbl_information ON tblaccount.userID = tbl_information.userID
    INNER JOIN tbl_userrole ON tblaccount.accountID = tbl_userrole.AccID
    WHERE tblaccount.username = ? AND tbl_userrole.role = ?
  `;

  db.query(sql, [username, role], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Failed to login.' });
    }

    if (!results.length) {
      return res.status(401).json({ message: 'Invalid credentials or role mismatch.' });
    }

    const user = results[0];

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const secretKey = process.env.SECRET_KEY;
    const payload = {
      userId: user.userID,
      accID: user.accountID,
      username: user.username,
      Fname: user.firstName,
      Lname: user.lastName,
      contact: user.contact,
      role: user.role,
    };
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });

    res.json({ 
      message: 'Login successful', 
      token, 
      redirectUrl: `../../pages/${role}/home.html` 
    });
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

app.post('/notifications', (req, res) => {
  const { accID, crimeType, description, latitude, longitude, street } = req.body;

  if (!accID || !crimeType || !latitude || !longitude) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const query = `
    INSERT INTO tblNotification (accID, crimeType, description, latitude, longitude, street)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [accID, crimeType, description, latitude, longitude, street], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error saving notification.' });
    }

    io.emit('new_notification'); // Notify staff in real-time
    res.status(200).json({ message: 'Notification added successfully.' });
  });
});

// View a notification and fetch location details
app.get('/notifications/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT * FROM tblNotification WHERE notificationID = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching notification.' });
    }
    res.json(results[0]);
  });
});

// Send a notification to tblreport
app.post('/notifications/send/:id', (req, res) => {
  const { id } = req.params;

  const moveQuery = `
    INSERT INTO tblreport (accID, crimeType, description, latitude, longitude, street)
    SELECT accID, crimeType, description, latitude, longitude, street
    FROM tblNotification WHERE notificationID = ?;
  `;
  const deleteQuery = `DELETE FROM tblNotification WHERE notificationID = ?`;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ message: 'Transaction error.' });

    // Move data to tblreport
    db.query(moveQuery, [id], (err) => {
      if (err) {
        return db.rollback(() => res.status(500).json({ message: 'Error moving notification.' }));
      }

      // Delete from tblNotification
      db.query(deleteQuery, [id], (err) => {
        if (err) {
          return db.rollback(() => res.status(500).json({ message: 'Error deleting notification.' }));
        }

        // Commit the transaction
        db.commit((err) => {
          if (err) {
            return db.rollback(() => res.status(500).json({ message: 'Commit error.' }));
          }

          // Fetch the inserted report from tblreport
          
          db.query('SELECT * FROM tblreport WHERE id = ?', [accID], (err, result) => {
            if (err) {
              return res.status(500).json({ message: 'Error fetching new report.' });
            }

            const newReport = result[0]; // Get the inserted report

            // Emit the new report to connected clients
            io.emit('new_report', newReport);

            // Respond to the client
            res.status(200).json({ message: 'Notification sent successfully.', report: newReport });
          });
        });
      });
    });
  });
});


// Delete a notification
app.delete('/notifications/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM tblNotification WHERE notificationID = ?`;
  db.query(query, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error deleting notification.' });
    }
    res.status(200).json({ message: 'Notification deleted successfully.' });
  });
});

app.get('/populatenotifications', (req, res) => {
  const query = `
    SELECT tblnotification.*, tbl_information.firstName, tbl_information.lastName, tbl_information.contact
    FROM tblnotification
    INNER JOIN tblaccount ON tblnotification.accID = tblaccount.accountID
    INNER JOIN tbl_information ON tblaccount.userID = tbl_information.userID;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching notifications.' });
    }
    res.json(results);
  });
});

app.post('/notifications/view', (req, res) => {
  const { notificationID } = req.body;

  // Fetch notification details
  const query = `SELECT * FROM tblnotification WHERE notificationID = ?`;
  db.query(query, [notificationID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching notification details.' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    res.json(result[0]); // Return notification details to the frontend
  });
});

app.post('/notifications/send', (req, res) => {
  const { notificationID } = req.body;

  // Move notification to tblreport
  const query = `
    INSERT INTO tblreport (accID, crimeType, description, latitude, longitude, street, createdAt)
    SELECT accID, crimeType, description, latitude, longitude, street, createdAt
    FROM tblnotification
    WHERE notificationID = ?;
  `;

  db.query(query, [notificationID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error sending notification.' });
    }

    const sql = `SELECT * FROM tblreport where reportID = ?`;

    // Remove notification from tblnotification
    const deleteQuery = `DELETE FROM tblnotification WHERE notificationID = ?`;
    db.query(deleteQuery, [notificationID], (deleteErr) => {
      if (deleteErr) {
        console.error(deleteErr);
        return res.status(500).json({ message: 'Error removing notification.' });
      }

      const insertedID = result.insertId; // The ID of the inserted record

      db.query(sql,[insertedID], (err, reportResult) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error feching report data'});
          }

          const report = reportResult[0];

          // Notify all connected clients about the new report
          io.emit('incident_confirmed', report);

          emitCircleData();

          res.json({ message: 'Notification sent and confirmed.' });

      });

    });
  });
});

app.post('/notifications/delete', (req, res) => {
  const { notificationID } = req.body;

  const query = `DELETE FROM tblnotification WHERE notificationID = ?`;
  db.query(query, [notificationID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error deleting notification.' });
    }
    res.json({ message: 'Notification deleted successfully.' });
  });
});

app.get('/reports', (req, res) => {
  const query = `
      SELECT tblreport.reportID, tblreport.crimeType, tblreport.description, tblreport.latitude, tblreport.longitude, tblreport.street, tblreport.createdAt, 
             tbl_information.firstName, tbl_information.lastName, tbl_information.contact
      FROM tblreport 
      INNER JOIN tblaccount ON tblreport.accID = tblaccount.accountID
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

//Middleware for verifying role
function verifyRole(role) {
  return (req, res, next) => {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
      const secretKey = process.env.SECRET_KEY;
      const decoded = jwt.verify(token, secretKey);

      if (decoded.role !== role) {
        return res.status(403).json({ message: 'Forbidden: Role mismatch' });
      }

      req.user = decoded; // Attach user data to the request object
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}


// Admin-only route
app.get('/admin/dashboard', verifyRole('Admin'), (req, res) => {
  res.json({ message: 'Welcome Admin' });
});

// Staff-only route
app.get('/staff/home', verifyRole('Staff'), (req, res) => {
  res.json({ message: 'Welcome Staff' });
});

// User-only route
app.get('/user/home', verifyRole('User'), (req, res) => {
  res.json({ message: 'Welcome User' });
});

// Logout endpoint
app.post('/logout', (req, res) => {
  res.clearCookie('auth_token'); // Clear the auth_token cookie
  res.json({ message: 'Logged out successfully' });
});

// Delete Account Function
app.post('/delete/:id', (req, res) => {
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

// Emit data to all connected clients whenever reports change
function emitCircleData() {
  const circles = [
    { id: 1, lat: 14.358134835918086, lng: 121.05912744998933, radius: 70}, // circle 5
    { id: 2, lat: 14.358368694422813, lng: 121.05800628662111, radius: 70}, //circle 4
    { id: 3, lat: 14.359368517975929, lng: 121.05887129902841, radius: 70}, //circle 3
    { id: 4, lat: 14.35726371083779, lng: 121.0584729909897, radius: 70}, //circle 6
    { id: 5, lat: 14.356084016287031, lng: 121.05936348438264, radius: 100}, //circle 7
    { id: 6, lat: 14.354467772690725, lng: 121.0602378845215, radius: 100}, // circle 8
    { id: 7, lat: 14.361260074803814, lng: 121.05718016624452, radius: 100}, //circle 1
    { id: 8, lat: 14.353574221433659, lng: 121.0618042945862, radius: 70}, // circle 9 
    { id: 9, lat: 14.351988816915645, lng: 121.0623461008072, radius: 100}, // circle 10
    { id: 10, lat: 14.349915528714972, lng: 121.06334924697877, radius: 100}, // circle 11
    { id: 11, lat: 14.359810491668052, lng: 121.05781316757204, radius: 70}, //circle 2
  ];

  const promises = circles.map(circle => {
    return new Promise((resolve, reject) => {
      // Query to find reports in the circle
      const query = `
        SELECT reportID
        FROM tblreport
        WHERE (
          6371000 * ACOS(
            COS(RADIANS(${circle.lat})) *
            COS(RADIANS(latitude)) *
            COS(RADIANS(longitude) - RADIANS(${circle.lng})) +
            SIN(RADIANS(${circle.lat})) *
            SIN(RADIANS(latitude))
          )
        ) <= ${circle.radius + 1}
      `;

      db.query(query, (err, results) => {
        if (err) return reject(err);

        // Extract reportIDs
        const reportIDs = results.map(row => row.reportID);
        if (reportIDs.length > 0) {
          // Update the circleID for reports
          const updateQuery = `
            UPDATE tblreport
            SET circleID = ?
            WHERE reportID IN (${reportIDs.map(() => '?').join(',')})
          `;
          db.query(updateQuery, [circle.id, ...reportIDs], (err) => {
            if (err) return reject(err);

            console.log(reportIDs);

            // Resolve with the count of updated reports
            resolve({ id: circle.id, count: reportIDs.length });
          });
        } else {
          resolve({ id: circle.id, count: 0 }); // No reports in this circle
        }
      });
    });
  });

  Promise.all(promises)
    .then(data => {
      io.emit('circle-data', data); // Emit data to all connected clients
      console.log('Emitting circle data:', data);
    })
    .catch(err => console.error('Error fetching circle data:', err));
}

app.post('/api/reports', (req, res) => {
  const { viewMode, startDate, endDate } = req.body;

  const newStartDate = `${startDate} 00:00:00`;
  const newEndDate = `${endDate} 23:59:59`;

  let query;
  let params = [newStartDate, newEndDate];

  if (viewMode === 'totalReports') {
    query = `
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m-%d') as date, 
        COUNT(*) as count 
      FROM tblreport 
      WHERE createdAt BETWEEN ? AND ? 
      GROUP BY DATE(createdAt)
    `;
  } else if (viewMode === 'totalCategory') {
    query = `
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m-%d') as date, 
        crimeType, 
        COUNT(crimeType) as count 
      FROM tblreport 
      WHERE createdAt BETWEEN ? AND ? 
      GROUP BY DATE(createdAt), crimeType
    `;
  } else {
    return res.status(400).json({ error: 'Invalid view mode' });
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


// Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  emitCircleData();

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
