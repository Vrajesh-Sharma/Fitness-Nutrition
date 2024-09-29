const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const JWT_SECRET = 'your-secret-key'; // In a real app, use an environment variable

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'fitness_new')));

const usersFilePath = path.join(__dirname, 'users.csv');

// Ensure users.csv exists
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, 'username,password,name\n');
}

const csvWriter = createCsvWriter({
  path: usersFilePath,
  header: [
    { id: 'username', title: 'username' },
    { id: 'password', title: 'password' },
    { id: 'name', title: 'name' }
  ],
  append: true
});

 // Middleware to check if the user is authenticated
 const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'fitness_new', 'index.html'));
});

app.post('/signup', (req, res) => {
  const { username, password, name } = req.body;
  
  const users = [];
  fs.createReadStream(usersFilePath)
    .pipe(csv())
    .on('data', (row) => {
      users.push(row);
    })
    .on('end', () => {
      const existingUser = users.find(user => user.username === username);
      if (existingUser) {
        res.status(400).json({ message: 'Username already exists' });
      } else {
        csvWriter.writeRecords([{ username, password, name }])
          .then(() => {
            res.status(201).json({ message: 'User created successfully' });
          })
          .catch((error) => {
            res.status(500).json({ message: 'Error creating user', error });
          });
      }
    });
});

app.post('/login', (req, res) => {
  console.log('Login route hit');
  console.log('Request body:', req.body);
  const { username, password } = req.body;
  
  console.log('Attempting login for:', username);
  
  // Generate a token without checking credentials
  const token = jwt.sign({ username: username, name: 'Test User' }, JWT_SECRET);
  console.log('Token generated:', token);
  
  // Send response
  console.log('Sending success response');
  res.json({ message: 'Login successful', token });
  
  console.log('Response sent');
});

// Add a test route to check if the server is responding
app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Server is responding' });
});





app.get('/api/user', authenticateToken, (req, res) => {
  console.log('Fetching user data for:', req.user.username);  // Debug log
  // Here you would typically fetch more user data from your database
  // For this example, we're just sending back the data from the token
  res.json({ 
    name: req.user.name,
    email: req.user.username,
    // Add more user details as needed
  });
});

// Serve dashboard.html
app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'fitness_new', 'dashboard.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Add these routes to your existing app.js

// Dummy data for BMI (you would typically store this in a database)
let bmiData = {};

app.post('/api/bmi', authenticateToken, (req, res) => {
    const { bmi } = req.body;
    const username = req.user.username;
    
    if (!bmiData[username]) {
        bmiData[username] = [];
    }
    
    bmiData[username].push({
        date: new Date().toISOString(),
        bmi: parseFloat(bmi)
    });
    console.log(`Saving BMI data for user ${username}: ${bmi}`);
    res.json({ message: 'BMI data saved successfully' });
});

app.get('/api/bmi', authenticateToken, (req, res) => {
    const username = req.user.username;
    res.json(bmiData[username] || []);
});

// Dummy data for food groups (you would typically store this in a database)
const foodGroupData = {
    labels: ['Fruits', 'Vegetables', 'Grains', 'Protein', 'Dairy'],
    values: [20, 30, 25, 15, 10]
};

app.get('/api/food-groups', authenticateToken, (req, res) => {
    res.json(foodGroupData);
});

// Update the existing /api/user route to include more user details
app.get('/api/user', authenticateToken, (req, res) => {
    console.log('Fetching user data for:', req.user.username);
    res.json({ 
        name: req.user.name,
        email: req.user.username,
        // Add more user details as needed
    });
});

const googleFitRoutes = require('./api/googleFit/routes');
app.use('/api/googlefit', googleFitRoutes);