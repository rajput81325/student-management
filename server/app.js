const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const bcrypt = require('bcryptjs');
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware Setup (Correct Order)
app.use(cors());
app.use(express.json());  // ✅ JSON body parsing enable
app.use(express.urlencoded({ extended: true })); // ✅ Form data parsing enable
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Debugging Middleware (Check if request body received)
app.use((req, res, next) => {
    console.log("📩 Request Body Debug:", req.body);
    next();
});

// 🔹 Express Session Setup
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
}));

// 🔹 Flash Messages Middleware
app.use(flash());

// 🔹 Flash Messages ko globally available banane ke liye middleware
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.log(err));

// ✅ User Model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,  // Hashed password
});

const User = mongoose.model('User', userSchema);

// ✅ Register Route (Fixed)
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!email || !password || !name || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword });

        await user.save();

        res.status(200).json({ success: true, message: "Registered successfully", redirect: "/login" });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Login Route (Fixed)
app.post('/login', async (req, res) => {
    try {
        console.log("📩 Login Attempt - Request Body:", req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        let user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found");
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Invalid password");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        req.session.user = user;
        console.log("✅ Login successful for:", user.email);
        res.status(200).json({ success: true, message: "Login successful", redirect: "/" });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            req.flash('error', '❌ Logout failed');
            return res.redirect('/dashboard');
        }
        res.redirect('/login');
    });
});

// ✅ Serve Static Files
app.use(express.static(path.join(__dirname, '../client/public')));

// ✅ Serve HTML Pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client/views/index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, '../client/views/about.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, '../client/views/contact.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, '../client/views/register.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../client/views/login.html')));
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        req.flash('error', '⚠ Please login first');
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, '../client/views/index.html'));
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
