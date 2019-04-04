const express = require('express');
const sudokuSolver = require('./naive-solver');
const { createEmptyBoard } = require('./board');

const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.json();
});

app.get('/sudoku/board', (req, res) => {
  const { board } = req.query;

  const solution = sudokuSolver.solveBoard(
    board ? board.split('').map(Number) : createEmptyBoard(),
  );
  res.json(solution);
});

app.listen(port, () => {
  console.log(`Sudoku server is listening on ${port}`);
})
