const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createPool({
  host: 'localhost',     // Replace with your Azure VM IP or hostname
  user: 'yourUsername',  // MySQL username
  password: 'yourPassword',  // MySQL password
  database: 'yarn_projects', // Database name
});

// POST: Create a new project
app.post('/api/projects', async (req, res) => {
  const { projectName, description, materials, status } = req.body;

  if (!projectName || !description) {
    return res.status(400).send('Project name and description are required.');
  }

  try {
    const query = `
      INSERT INTO projects (projectName, description, materials, status)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      projectName,
      description,
      JSON.stringify(materials || []),
      status || 'ongoing',
    ]);

    const createdProject = {
      id: result.insertId,
      projectName,
      description,
      materials: materials || [],
      status: status || 'ongoing',
    };

    res.status(201).json(createdProject);
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).send('Error saving the project.');
  }
});

// GET: Retrieve all projects
app.get('/api/projects', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM projects');
    res.status(200).json(rows.map(row => ({
      ...row,
      materials: JSON.parse(row.materials), // Convert materials back to JSON
    })));
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).send('Error fetching projects.');
  }
});

// PUT: Update a project
app.put('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { projectName, description, materials, status } = req.body;

  try {
    const query = `
      UPDATE projects
      SET projectName = ?, description = ?, materials = ?, status = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [
      projectName,
      description,
      JSON.stringify(materials || []),
      status || 'ongoing',
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).send('Project not found.');
    }

    res.status(200).send('Project updated successfully.');
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).send('Error updating the project.');
  }
});

// DELETE: Remove a project
app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM projects WHERE id = ?';
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send('Project not found.');
    }

    res.status(200).send('Project deleted successfully.');
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).send('Error deleting the project.');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


  


