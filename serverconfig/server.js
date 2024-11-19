const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app =express();
const PORT = 3000;

//Middleware
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'Crochet-App'))); //Server for static files

//file to store project data (simulate a database)
const DATA_FILE = path.join(__dirname, 'data', 'projects.json');
fs.mkdir(path.join(__dirname, 'data'), {recursive: true}).catch(console.error);

// API Routes
// GET: Retrieve all ongoing projects
app.get('/api/projects', async (req, res) => {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      res.json(JSON.parse(data));
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist yet
        res.json([]);
      } else {
        console.error(error);
        res.status(500).send('Error reading projects data.');
      }
    }
  });
  
  // POST: Add a new ongoing project
  app.post('/api/projects', async (req, res) => {
    const { projectName, description, materials } = req.body;
  
    if (!projectName || !description || !materials) {
      return res.status(400).send('All fields are required: projectName, description, materials.');
    }
  
    try {
      // Read existing projects
      let projects = [];
      try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        projects = JSON.parse(data);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error; // Ignore if file doesn't exist
      }
  
      // Add new project
      const newProject = { id: Date.now(), projectName, description, materials, status: 'ongoing' };
      projects.push(newProject);
  
      // Save to file
      await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2));
      res.status(201).json(newProject);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error saving the project.');
    }
  });

  // PUT: Edit an existing project
app.put('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    const { projectName, description, materials } = req.body;
  
    if (!projectName || !description || !materials) {
      return res.status(400).send('All fields are required: projectName, description, materials.');
    }
  
    try {
      // Read existing projects
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      const projects = JSON.parse(data);
  
      // Find and update the project
      const projectIndex = projects.findIndex((proj) => proj.id === parseInt(id, 10));
      if (projectIndex === -1) return res.status(404).send('Project not found.');
  
      projects[projectIndex] = {
        ...projects[projectIndex],
        projectName,
        description,
        materials,
      };
  
      // Save updated projects
      await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2));
      res.json(projects[projectIndex]);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating the project.');
    }
  });

  


