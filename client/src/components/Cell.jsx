import React from 'react';

export default function Cell({ number, selected, onClick }) {
  const className = selected ? 'selected' : '';

  return (
    <td>
      <button
        className={className}
        onClick={onClick}
      >
        {number}
      </button>
    </td>
  );
}
