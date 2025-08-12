const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/keywords - List all keywords for the current user
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM keywords WHERE userId = ?');
    const keywords = stmt.all(req.user.id);
    res.json(keywords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/keywords - Add a new keyword
router.post('/', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Keyword text is required' });
  }
  const userId = req.user.id;

  try {
    const stmt = db.prepare('INSERT INTO keywords (userId, text) VALUES (?, ?)');
    const info = stmt.run(userId, text);
    res.status(201).json({ id: info.lastInsertRowid, userId, text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/keywords/:id - Remove a keyword
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const stmt = db.prepare('DELETE FROM keywords WHERE id = ? AND userId = ?');
    const info = stmt.run(id, userId);
    if (info.changes > 0) {
      res.status(200).json({ message: 'Keyword deleted successfully' });
    } else {
      res.status(404).json({ error: 'Keyword not found or you do not have permission to delete it' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
