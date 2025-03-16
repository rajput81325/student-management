app.post('/api/login', async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debug request body

        const { email, password } = req.body;
        console.log("Login Attempt:", email, password); // Debugging ke liye

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        let user = await User.findOne({ email });
        console.log("Database Response:", user); // Check what MongoDB returns

        if (!user) {
            console.log("User not found in Database");
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Invalid password");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        req.session.user = user;
        console.log("Login successful for:", user.email);

        res.status(200).json({ success: true, message: "Login successful", redirect: "/" });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});
