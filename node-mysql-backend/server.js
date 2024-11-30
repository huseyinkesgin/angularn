const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('./db');

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/cities', (req, res) => {
  const query = 'SELECT * FROM cities';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching cities:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/cities', (req, res) => {
  const { name, code, is_active } = req.body;
  const query = 'INSERT INTO cities (name, code, is_active) VALUES (?, ?, ?)';
  connection.query(query, [name, code, is_active], (err, results) => {
    if (err) {
      console.error('Error adding city:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.status(201).json({ id: results.insertId, name, code, is_active });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});