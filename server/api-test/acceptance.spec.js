const axios = require('axios');
const { spawn } = require('child_process');

const { createEmptyBoard, boardIsSolved } = require('../src/board');

describe('GET /sudoku/board', () => {
  let server = null;

  beforeAll(async () => {
    // Start the server in a separate process
    server = spawn(
      'npm',
      ['run', 'start'],
      { stdio: ['ignore', 'inherit', 'inherit'] },
    );
    // Wait for the server to become ready
    for (let i = 0; i < 500; i++) {
      try {
        const res = await axios.get('http://localhost:8080/');
        if (res.status === 200) {
          break;
        }
      } catch (e) {
        // ignore the error
      }

      await delayMs(200);
    }
  }, 10000);
  afterAll(() => {
    // Stop the server process
    server.kill();
  });

  describe('generate new board', () => {
    let previousBoards = null;

    beforeAll(() => {
      previousBoards = [];
    });

    for (let i = 0; i < 3; i++) {
      describe(`attempt #${i+1}`, () => {
        let res = null;

        test('request succeeds in <500ms', async () => {
          res = await axios.get('http://localhost:8080/sudoku/board');
          expect(res.status).toEqual(200);
        }, 500);

        test('content-type set to JSON', async () => {
          expect(res.headers).toHaveProperty(
            'content-type',
            expect.stringMatching(/^application\/json(; charset=utf-8)?$/),
          );
        });

        test('board is solved', async () => {
          expect(boardIsSolved(res.data)).toEqual(true);
        });

        test('board is random', async () => {
          // A way to ensure the boards are indeed random. If the boards are really
          // random, the change of getting the same solution more than once is very
          // small. Not zero though.
          expect(previousBoards).not.toContainEqual(res.data);
          previousBoards.push(res.data);
        });
      });
    }
  });

  describe('solve given board', () => {
    let previousBoards = null;

    beforeAll(() => {
      previousBoards = [];
    });

    for (let i = 0; i < 3; i++) {
      describe(`attempt #${i+1}`, () => {
        let res = null;

        test('request succeeds in <500ms', async () => {
          const b = createEmptyBoard();
          b[73] = 1;
          b[78] = 4;
          b[79] = 7;
          b[80] = 9;
          res = await axios.get(
            `http://localhost:8080/sudoku/board?board=${b.join('')}`,
          );
          expect(res.status).toEqual(200);
        }, 500);

        test('content-type set to JSON', async () => {
          expect(res.headers).toHaveProperty(
            'content-type',
            expect.stringMatching(/^application\/json(; charset=utf-8)?$/),
          );
        });

        test('board is solved', async () => {
          expect(boardIsSolved(res.data)).toEqual(true);
        });

        test('board contains selected cells', async () => {
          expect(res.data[73]).toEqual(1);
          expect(res.data[78]).toEqual(4);
          expect(res.data[79]).toEqual(7);
          expect(res.data[80]).toEqual(9);
        });

        test('board is random', async () => {
          // A way to ensure the boards are indeed random. If the boards are really
          // random, the change of getting the same solution more than once is very
          // small. Not zero though.
          expect(previousBoards).not.toContainEqual(res.data);
          previousBoards.push(res.data);
        });
      });
    }
  });

  describe('unsolvable board', () => {
    // Unsolveable board
    // (https://www.quora.com/Has-anyone-ever-seen-an-unsolvable-Sudoku/answers/2321127)
    // 
    // 1 2 3  - - -  7 4 5
    // 4 5 6  - - -  8 2 3
    // 7 8 9  - - -  6 1 -
    const b = createEmptyBoard();
    // First box
    [b[ 0], b[ 1], b[ 2]] = [1, 2, 3];
    [b[ 9], b[10], b[11]] = [4, 5, 6];
    [b[18], b[19], b[20]] = [7, 8, 9];
    // Third box
    [b[ 6], b[ 7], b[ 8]] = [7, 4, 5];
    [b[15], b[16], b[17]] = [8, 2, 3];
    [b[24], b[25], b[26]] = [6, 1, 0];

    test('request succeeds in <500ms', async () => {
      res = await axios.get(
        `http://localhost:8080/sudoku/board?board=${b.join('')}`,
      );
      expect(res.status).toEqual(200);
    }, 500);

    test('content-type set to JSON', async () => {
      expect(res.headers).toHaveProperty(
        'content-type',
        expect.stringMatching(/^application\/json(; charset=utf-8)?$/),
      );
    });

    test('board is not solved', async () => {
      expect(res.data).toBeNull();
      expect(boardIsSolved(res.data)).toEqual(false);
    });
  });
});

const delayMs = ms => new Promise(resolve => setTimeout(resolve, ms));
