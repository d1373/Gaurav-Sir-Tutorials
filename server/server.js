const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // Import authRoutes module
const subjectRoutes = require('./routes/subjectRoutes'); // Ensure this line is included
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Use authRoutes
app.use('/api/subjects', subjectRoutes);
// Serve static files from the React app
//const path = require('path');
//app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

//// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
//app.get('*', (req, res) => {
//res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
//});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
