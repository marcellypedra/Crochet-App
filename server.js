const express = require('express');
const mysql = require('mysql12');
const path = require('path');
const app =express();

const PORT = process.env.PORT || 3000;

//MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
      console.error('Error connecting to MySQL:', err);
      process.exit(1);
  }
  console.log('Connected to MySQL');
});

// // Serve static files (HTML, CSS, JS files)
app.use(express.static(path.join(__dirname, 'public')));

// GET: Retrieve all ongoing projects
app.get('/api/projects', async (req, res) => {
    db.query 
    ()      const data = await fs.readFile(DATA_FILE, 'utf-8');
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

  


