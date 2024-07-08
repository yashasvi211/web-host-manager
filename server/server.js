import express, { json } from 'express';
import { createConnection } from 'mysql2';
import bcrypt from 'bcrypt';
import cors from 'cors';

const app = express();
app.use(json());
app.use(cors());

const db = createConnection({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12717010',
  password: '549m9Agyy7',
  database: 'sql12717010',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  db.query('SELECT * FROM employees WHERE username = ?', [username], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const user = results[0];
    
    //Gonna use bcrypt to compare hashed passwords but later maybe
    if (password === user.password) {
      res.json({ 
        message: 'Login successful', 
        user: { 
          id: user.id, 
          employee_name: user.employee_name, 
          username: user.username, 
          position: user.position 
        } 
      });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });
});

// Register route
app.post('/register', (req, res) => {
  const { employee_name, username, password, position } = req.body;
  
  // Check if username already exists
  db.query('SELECT * FROM employees WHERE username = ?', [username], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }

    // In a real-world scenario, you should hash the password before storing it
    const query = 'INSERT INTO employees (employee_name, username, password, position) VALUES (?, ?, ?, ?)';
    db.query(query, [employee_name, username, password, position], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    });
  });
});
// Fetch users route
app.get('/users', (req, res) => {
  db.query('SELECT * FROM Users', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});