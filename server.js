const express = require('express');
const path = require('path');
const app = express();
const os = require("os");
const multer = require ('multer'); //include multer for picture hadling
const bcrypt = require('bcryptjs'); //include bcryptjs for password hashing
const { promisePool } = require('./db');

// Configure multer to store uploaded images in the 'uploads' folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads')); // Save files in 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

//Middleware setup
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json()); //Middleware to parse JSON
app.use(express.urlencoded({ extended: true }));  // Middleware to parse URL-encoded bodies

// Function to get local IP address dynamically
function getLocalIPAddress() {
    const localnetwork = os.localnetwork();
    for (let networkName in localnetwork) {
        for (let networklocal of localnetwork[networkName]) {
            if (!networklocal.internal && networklocal.family === 'IPv4') {
                return networklocal.address; 
            }
        }
    }
    return 'localhost'; 
}

// Get all projects
app.get("/api/projects", async (req, res) => {
    try {
        console.log("Fetching projects...");
        
          // Get the local IP dynamically
          const localIP = getLocalIPAddress();
          const baseURL = `http://${localIP}:3000`;

        // Query to fetch ongoing projects
        const [ongoingProjects] = await promisePool.execute('SELECT * FROM projects WHERE project_type = "ongoing"');

        // Query to fetch closed projects
        const [closedProjects] = await promisePool.execute('SELECT * FROM projects WHERE project_type = "closed"');

        console.log("Ongoing Projects:", ongoingProjects);
        console.log("Closed Projects:", closedProjects);
        // Parse materials field if needed
        ongoingProjects.forEach(project => {
            try {
                project.materials = JSON.parse(project.materials) || [];
            } catch {
                project.materials = []; //convert from JSON to array

            } 
            if (project.image) {
                project.image = `${baseURL}${project.image}`;
            
            }
        });

        closedProjects.forEach(project => {
            try {
                project.materials = JSON.parse(project.materials) || [];
            } catch {
                project.materials = []; //convert from JSON to array

            } 
            if (project.image) {
                project.image = `${baseURL}${project.image}`;
            
            } 
        });

        // Send both sets of projects as a response
        res.json({ ongoingProjects, closedProjects });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
 


// Add a new project
app.post('/api/projects', async (req, res) => {
    const { name, description, url, project_type, materials } = req.body;

    // Check if required fields are present
    if (!name || !project_type) {
        return res.status(400).json({ message: "Missing required fields: name or project_type" });
    }

    try {
        // Insert the new project into the database
        const [result] = await promisePool.execute(
            'INSERT INTO projects (name, description, url, project_type, materials) VALUES (?, ?, ?, ?, ?)',
            [name, description, url, project_type, JSON.stringify(materials)]  // Store materials as a JSON string
        );

        // Send a success response with the ID of the new project
        res.status(201).json({ message: "Project created successfully", projectId: result.insertId });
    } catch (error) {
        console.error("Error saving project:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update a project
app.patch("/api/projects/:id", upload.single("image"), async (req, res) => {
    const { id } = req.params;
    const { name, description, url, materials } = req.body;
    try {
        const [[project]] = await promisePool.execute(
            "SELECT project_type FROM projects WHERE id = ?",
            [id]
        );
         if (!project) {
            return res.status(404).json({ message: "Project not found"});

         }

        // If an image file is uploaded, prepare the image path

        let imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        let updateQuery = 
            'UPDATE projects SET name = ?, description = ?, url = ?, materials = ? ';

        //Add the image field if applicable
        const queryParams = [name, description, url, JSON.stringify(materials)];

        if (imagePath) {
            updateQuery += ", image = ?";
            queryParams.push(imagePath);
        }
        
        //Add the condition for Project ID
        updateQuery += " Where id = ?";
        queryParams.push(id);

        //Execute the update query
        await promisePool.execute(updateQuery, queryParams);
            
        res.json({message: "Project updated"});
     } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({message: "Internal Server Error" });
     }
});

// Delete a project
app.delete("/api/projects/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        await promisePool.execute('DELETE FROM projects WHERE id = ?', [id]);
        res.send("Project deleted");
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Mark project as closed
app.patch("/api/projects/:id/close", async (req, res) => {
    const { id } = req.params;
    try {
        await promisePool.execute( 
            'UPDATE projects SET project_type = ? WHERE id = ?', ['closed', id]);
             res.send("Project marked as closed");
    } catch (error) {
        console.error("Error closing project:", error);
        res.status(500).json({message: "Internal Server Error" });
     }
});

// Create user
app.post('/api/register', async (req, res) => {
    const {username, email, password} = req.body;
// Check if required fields are present
if (!username || !email || !password){
    return res.status(400).json({ message: "Missing required fields: name, email and password" });
}

try {
    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Save the user to the database

    const [result] = await promisePool.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully", userId: result.insertId });
} catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Internal Server Error" });
}
});


//Login validation
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Fetch user by email
        const [rows] = await promisePool.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = rows[0];

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Successful login
        res.status(200).json({ 
            message: "Login successful",
            user: { user_id: user.id, username: user.username, email: user.email }
        });

    } catch (error) {
        console.error("Error during login validation:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//Reset Password
app.patch('/api/reset-password', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and new password are required.' });
    }

    try {
        // Find user by email
        const [rows] = await promisePool.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update the user's password 
        const hashedPassword = await bcrypt.hash(password, 10); 
        await promisePool.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);



        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

if (require.main === module)
    app.listen(3000, () => console.log("Server running on port 3000"));

module.exports = app;
