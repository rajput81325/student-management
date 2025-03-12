const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../client/public')));

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
app.use('/api/users', userRoutes);

// Frontend routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/contact.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});