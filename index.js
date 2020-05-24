const express = require('express');
const server = express();

server.use(express.json());

let numberOfRequests = 0;
const projects = [];

// Middleware global

function requestCounter(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
}

// Middleware to check if project exists

function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id === id);

  if (!project)
    return res.status(400).json({ error: 'Project does not exist!' });

  return next();
}

server.get('/projects', requestCounter, (req, res) => {
  // List all
  return res.json(projects);
});

server.post('/projects', requestCounter, (req, res) => {
  // Create project
  projects.push(req.body);
  return res.json(projects);
});

server.delete(
  '/projects/:id',
  requestCounter,
  checkProjectExists,
  (req, res) => {
    // Delete project
    const { id } = req.params;

    const index = projects.findIndex(p => p.id === id);
    projects.splice(index, 1);

    return res.json(projects);
  }
);

server.put('/projects/:id', requestCounter, checkProjectExists, (req, res) => {
  // Update project
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(p => p.id === id);
  project.title = title;

  return res.json(project);
});

server.post(
  '/projects/:id/tasks',
  requestCounter,
  checkProjectExists,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id === id);
    project.tasks.push(title);

    res.json(projects);
  }
);

server.listen(3000);
