const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

let notes = [];
let nextId = 1; // Numeric ID generator

// Root route for health check
app.get('/', (req, res) => {
  res.json({ message: 'Notes API is running' });
});

// Get all notes
app.get('/notes', (req, res) => {
  res.json(notes);
});

// Get a note by ID
app.get('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const note = notes.find(n => n.id === id);
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }
  res.json(note);
});

// Add a new note
app.post('/notes', (req, res) => {
  let { title, content } = req.body;
  title = title ? title.trim() : '';
  content = content ? content.trim() : '';

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  const newNote = {
    id: nextId++,
    title,
    content,
    createdAt: new Date().toISOString()
  };
  notes.push(newNote);
  res.status(201).json(newNote);
});

// Update a note by ID
app.put('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  let { title, content } = req.body;
  title = title ? title.trim() : '';
  content = content ? content.trim() : '';

  const note = notes.find(n => n.id === id);

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  note.title = title;
  note.content = content;

  res.json(note);
});

// Delete a note by ID
app.delete('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = notes.findIndex(n => n.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Note not found' });
  }

  notes.splice(index, 1);
  res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Notes API server running on http://localhost:${PORT}`);
});
