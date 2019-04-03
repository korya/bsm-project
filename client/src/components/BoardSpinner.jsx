import React from 'react';
import Spinner from './Spinner';
import './Board.css';

export default function BoardSpinner() {
  return (
    <div className="sudoku-board-empty">
      <Spinner />
    </div>
  );
}
