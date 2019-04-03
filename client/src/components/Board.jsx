import React from 'react';
import Cell from './Cell';
import './Board.css';

export default function Board({ board, selected, onCellClick }) {
  return (
    <table className="sudoku-board">
      <tbody>
        {
          seq(9).map(i => (
            <tr key={i}>
              {
                seq(9).map(j => {
                  const idx = i * 9 + j;
                  return (
                    <Cell
                      key={idx}
                      number={board[idx]}
                      selected={selected[idx]}
                      onClick={() => onCellClick(idx)}
                    />
                  );
                })
              }
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}

const seq = length => Array.from({ length }).map((n, idx) => idx);
