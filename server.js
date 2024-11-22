const express = require('express');
const mysql = require('mysql');
const app = express();


app.use(express.json());

//Create Connection with MySql
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Viajantes*01',
    database: 'Crochet_App'
});

db.connect();

// Get all projects
app.get("/api/projects", (req, res) => {
    const query = `
        SELECT * FROM projects WHERE projectType ='ongoing';
        SELECT * FROM projects WHERE projectType = 'closed';
    `;
    db.query(query, [ongoing, closed], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ ongoingProjects: results[0], closedProjects: results[1] });
    });
});
 


// Add a new project
app.post("/api/projects", (req, res) => {
    const { name, description, url, projectType, materials } = req.body;
    const query = "INSERT INTO projects  SET ?";
    db.query(query, { name, description, url, projectType, materials: JSON.stringify(materials) }, (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).send("Project created");
    });
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
    const query = "UPDATE projects SET projectType = 'closed' WHERE id = ?";
    db.query(query, [id], (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.send("Project marked as closed");
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));