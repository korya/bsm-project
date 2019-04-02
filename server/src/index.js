const express = require('express');
const sudokuSolver = require('./naive-solver');

const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.json();
});

app.get('/sudoku/board', (req, res) => {
  res.json(sudokuSolver.genRandomBoard());
});

app.listen(port, () => {
  console.log(`Sudoku server is listening on ${port}`);
})
