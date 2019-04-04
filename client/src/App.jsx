import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import BoardSpinner from './components/BoardSpinner';
import Button from './components/Button';
import './App.css';

export default function App() {
  const [requested, setRequested] = useState(1);
  const [board, setBoard] = useState(null);
  const [selected, setSelected] = useState(new Array(81).fill(false));

  useEffect(() => {
    const b = !board || selected.every(v => !v) ? '' :
      board.map((n, idx) => selected[idx] ? n : 0).join('');

    setBoard(null);
    fetch(`/sudoku/board?board=${b}`)
      .then(res => res.json())
      .then(board => setBoard(board));
  }, [requested]);

  return (
    <div className="App">
      <h1>Sudoku</h1>
      {board ?
        <Board
          board={board}
          selected={selected}
          onCellClick={idx => {
            const newSelected = selected.slice();
            newSelected[idx] = !newSelected[idx];
            setSelected(newSelected);
          }}
        /> :
        <BoardSpinner />
      }
      <Button onClick={() => setRequested(requested + 1)}>Reload</Button>
    </div>
  );
}
