const {
  emptyBoard,
  hasConflictsAt,
} = require('./board');
const { shuffleArray } = require('./utils');

const solveBoard = board => {
  const solution = board.slice();

  return solveBoardAux(solution, 0) ? solution : null;
};

const solveBoardAux = (board, currendIdx) => {
  if (currendIdx >= 81) {
    return true;
  }

  if (board[currendIdx] > 0) {
    return solveBoardAux(board, currendIdx + 1);
  }

  for (const n of getAvailableNumbers()) {
    board[currendIdx] = n;
    if (hasConflictsAt(board, currendIdx)) {
      continue;
    }

    if (solveBoardAux(board, currendIdx + 1)) {
      return true;
    }
  }

  board[currendIdx] = 0;
  return false;
};

const getAvailableNumbers = () => shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

module.exports = {
  genRandomBoard: () => solveBoard(emptyBoard()),
};
