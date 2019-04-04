const { maskSet, maskGet } = require('./utils');

const createEmptyBoard = () => new Array(81).fill(0);

const boardIsSolved = board => {
  if (!Array.isArray(board) || board.length !== 81) {
    return false;
  }

  for (let i = 0; i < 9; i++) {
    if (!segmentIsSolved(board, iterateRow(i))) {
      return false;
    }

    if (!segmentIsSolved(board, iterateCol(i))) {
      return false;
    }
  }

  for (let i = 0; i < 9; i += 3) {
    for (let j = 0; j < 9; j += 3) {
      if (!segmentIsSolved(board, iterateBox([ i, j ]))) {
        return false;
      }
    }
  }

  return true;
};

const boardIsSolveable = board => {
  if (!Array.isArray(board) || board.length !== 81) {
    return false;
  }

  for (let i = 0; i < 9; i++) {
    if (segmentsHasDups(board, iterateRow(i))) {
      return false;
    }

    if (segmentsHasDups(board, iterateCol(i))) {
      return false;
    }
  }

  for (let i = 0; i < 9; i += 3) {
    for (let j = 0; j < 9; j += 3) {
      if (segmentsHasDups(board, iterateBox([ i, j ]))) {
        return false;
      }
    }
  }

  return true;
};

const hasConflictsAt = (board, idx) => {
  const { row, col, box } = getPosForIdx(idx);

  return segmentsHasDups(board, iterateRow(row)) ||
    segmentsHasDups(board, iterateCol(col)) ||
    segmentsHasDups(board, iterateBox(box));
};

const segmentsHasDups = (board, iterator) => {
  let mask = 0;
  for (const idx of iterator) {
    const n = board[idx];
    if (n > 0 && maskGet(mask, n)) {
      return true
    }

    mask = maskSet(mask, n);
  }

  return false;
};

const segmentIsSolved = (board, iterator) => {
  let sum = 0;
  let mask = 0;
  for (const idx of iterator) {
    const n = board[idx];
    if (n < 1 || n > 9 || maskGet(mask, n)) {
      return false;
    }

    sum += n;
    mask = maskSet(mask, n);
  }

  // The sum of numbers [1, 9] is (1+9)*9/2 = 45
  return sum === 45;
};

function* iterateRow(row) {
  const startIdx = row * 9;
  for (let idx = startIdx; idx < startIdx + 9; idx++) {
    yield idx;
  }
};

function* iterateCol(col) {
  for (let idx = col; idx < 81; idx += 9) {
    yield idx;
  }
};

function* iterateBox([ topLeftRow, topLeftCol ]) {
  const startIdx = topLeftRow * 9 + topLeftCol;
  for (let i = startIdx; i < startIdx + 27; i += 9) {
    for (let j = 0; j < 3; j++) {
      yield i + j;
    }
  }
};

const getPosForIdx = idx => {
  const row = Math.floor(idx / 9);
  const col = idx - row * 9;
  // Box is identified by its top left corner.
  const box = [
    Math.floor(row / 3) * 3,
    Math.floor(col / 3) * 3,
  ];

  return { row, col, box };
};

module.exports = {
  createEmptyBoard,
  boardIsSolved,
  boardIsSolveable,
  hasConflictsAt,
  getPosForIdx,
  segmentsHasDups,
  segmentIsSolved,
  iterateRow,
  iterateCol,
  iterateBox,
};
