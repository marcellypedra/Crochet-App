const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();


app.use(express.static(path.join(__dirname, 'public')));

//Middleware to parse JSON
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

//Create Connection with MySql
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Viajantes*01',
    database: 'Crochet_App',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();


// Get all projects
app.get("/api/projects", async (req, res) => {
    try {
        console.log("Fetching projects...");
        // Query to fetch ongoing projects
        const [ongoingProjects] = await promisePool.execute('SELECT * FROM projects WHERE project_type = "ongoing"');

        // Query to fetch closed projects
        const [closedProjects] = await promisePool.execute('SELECT * FROM projects WHERE project_type = "closed"');

        console.log("Ongoing Projects:", ongoingProjects);
        console.log("Closed Projects:", closedProjects);
        // Parse materials field if needed
        ongoingProjects.forEach(project => {
            project.materials = JSON.parse(project.materials); // Convert string back to array
        });

        closedProjects.forEach(project => {
            project.materials = JSON.parse(project.materials); // Convert string back to array
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
app.put("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    const { name, description, url, materials } = req.body;
    const query = 'UPDATE projects SET name = ?, description = ?, url = ?, materials = ? WHERE id = ?';
    db.query(query, [name, description, url, JSON.stringify(materials), id], (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.send("Project updated");
    });
});

// Delete a project
app.delete("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM projects WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.send("Project deleted");
    });
});

// Mark project as closed
app.put("/api/projects/:id/close", (req, res) => {
    const { id } = req.params;
    const query = "UPDATE projects SET project_type = 'closed' WHERE id = ?";
    db.query(query, [id], (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.send("Project marked as closed");
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));
