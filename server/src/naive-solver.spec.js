const { genRandomBoard } = require('./naive-solver');
const { isValidBoard } = require('./board');

test('genRandomBoard', () => {
  const previousBoards = [];
  // XXX Not sure how to seed the RNG used by Math.random().
  for (let i = 0; i < 100; i++) {
    const b = genRandomBoard();
    expect(isValidBoard(b)).toEqual(true);
    // A way to ensure the boards are indeed random. If the boards are really
    // random, the change of getting the same solution more than once is very
    // small. Not zero though.
    expect(previousBoards).not.toContain(b);
    previousBoards.push(b);
  }
});
