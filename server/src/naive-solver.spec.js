const { genRandomBoard, solveBoard } = require('./naive-solver');
const { createEmptyBoard, boardIsSolved } = require('./board');

test('genRandomBoard', () => {
  const previousBoards = [];
  // XXX Not sure how to seed the RNG used by Math.random().
  for (let i = 0; i < 100; i++) {
    const b = genRandomBoard();
    expect(boardIsSolved(b)).toEqual(true);
    // A way to ensure the boards are indeed random. If the boards are really
    // random, the change of getting the same solution more than once is very
    // small. Not zero though.
    expect(previousBoards).not.toContainEqual(b);
    previousBoards.push(b);
  }
});

describe('solveBoard', () => {
  test('generate random valid boards', () => {
    const previousBoards = [];
    // XXX Not sure how to seed the RNG used by Math.random().
    for (let i = 0; i < 100; i++) {
      const b = createEmptyBoard();
      b[12] = 7;
      b[37] = 9;
      b[76] = 4;
      const solution = solveBoard(b);
      expect(boardIsSolved(solution)).toEqual(true);
      expect(solution[12]).toEqual(7);
      expect(solution[37]).toEqual(9);
      expect(solution[76]).toEqual(4);
      // A way to ensure the boards are indeed random. If the boards are really
      // random, the change of getting the same solution more than once is very
      // small. Not zero though.
      expect(previousBoards).not.toContainEqual(solution);
      previousBoards.push(solution);
    }
  });

  test('return null for unsolveable boards', () => {
    const b = createEmptyBoard();
    b[8] = 1;
    b[80] = 1;
    expect(solveBoard(b)).toBeNull();
  });

  test('solve hard real-life boards', () => {
    // Couple boards from https://www.kaggle.com/bryanpark/sudoku
    const boards = [
      '004300000890200670700900050500008140070032060600001308001750900005040012980006005',
      '000700900004300527010006084800094053040001200962080070100869000700020130059000000',
      '000700900004300527010006084800094053040001200962080070100869000700020130059000000',
      '008060700030870012000205930000700504905004000802903070106000080009120360700000250',
      '000800000700040560563100090400300007050009002618004000000208304000060700290530180',
    ];

    for (const str of boards) {
      const b = str.split('').map(Number);
      const solution = solveBoard(b.slice());
      expect(boardIsSolved(solution)).toEqual(true);
      b.forEach((n, idx) => {
        if (!n) {
          solution[idx] = 0;
        }
      });
      expect(solution).toEqual(b);
    }
  });
});
