import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import BoardSpinner from './components/BoardSpinner';
import Button from './components/Button';
import './App.css';

export default function App() {
  const [requested, setRequested] = useState(1);
  const [board, setBoard] = useState(null);

  useEffect(() => {
    setBoard(null);
    fetch('/sudoku/board')
      .then(res => res.json())
      .then(board => setBoard(board));
  }, [requested]);

  return (
    <div className="App">
      <h1>Sudoku</h1>
      {board ? <Board board={board}/> : <BoardSpinner />}
      <Button onClick={() => setRequested(requested + 1)}>Reload</Button>
    </div>
  );
}
