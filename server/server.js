import express, { json } from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(json());
app.use(cors());

const db = mysql.createConnection({
  host: 'mysql-2e39c14-webhostmanagement.h.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_4Mz6S6FkgfeOtZj9UGU',
  database: 'webhostmanagement',
  port: 19266,
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
      console.error('Error during login query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }
    
    const user = results[0];
    
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
  
  db.query('SELECT * FROM employees WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error during register query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    if (results.length > 0) {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }
    
    const query = 'INSERT INTO employees (employee_name, username, password, position) VALUES (?, ?, ?, ?)';
    db.query(query, [employee_name, username, password, position], (err, result) => {
      if (err) {
        console.error('Error during insert query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      
      res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    });
  });
});

// Fetch users route
app.get('/users', (req, res) => {
  const query = `
    SELECT u.*, up.expiry_date, p.plan_name
    FROM Users u
    LEFT JOIN UserPlans up ON u.user_id = up.user_id
    LEFT JOIN Plans p ON up.plan_id = p.plan_id
    ORDER BY u.user_id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error during fetch users query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('User data being sent:', JSON.stringify(results, null, 2));
    res.json(results);
  });
});

// Fetch individual user details
app.get('/users/:userId', (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT 
      u.*,
      up.user_plan_id, up.start_date, up.expiry_date, up.auto_renew,
      p.plan_name, p.cpu_cores, p.ram_gb, p.storage_gb, p.bandwidth_gb, p.price_monthly,
      s.server_id, s.server_name, s.ip_address, s.location, s.status,
      i.invoice_id, i.amount, i.issue_date, i.due_date, i.status AS invoice_status,
      pm.payment_method_id, pm.method_type, pm.details AS payment_details,
      st.ticket_id, st.subject, st.description, st.status AS ticket_status, st.created_at, st.updated_at,
      su.usage_id, su.cpu_usage_percent, su.ram_usage_percent, su.storage_usage_gb, su.bandwidth_usage_gb, su.timestamp AS usage_timestamp
    FROM Users u
    LEFT JOIN UserPlans up ON u.user_id = up.user_id
    LEFT JOIN Plans p ON up.plan_id = p.plan_id
    LEFT JOIN UserServers us ON u.user_id = us.user_id
    LEFT JOIN Servers s ON us.server_id = s.server_id
    LEFT JOIN Invoices i ON u.user_id = i.user_id
    LEFT JOIN PaymentMethods pm ON u.user_id = pm.user_id
    LEFT JOIN SupportTickets st ON u.user_id = st.user_id
    LEFT JOIN ServerUsage su ON us.user_server_id = su.user_server_id
    WHERE u.user_id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error during fetch user details query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    console.log('User detail data being sent:', JSON.stringify(results, null, 2));
    res.json(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});