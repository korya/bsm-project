const axios = require('axios');
const { spawn } = require('child_process');

const { isValidBoard } = require('../src/board');

describe('GET /sudoku/board', () => {
  let server = null;
  let previousBoards = null;

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

      test('board is valid', async () => {
        expect(isValidBoard(res.data)).toEqual(true);
      });

      test('board is random', async () => {
        // A way to ensure the boards are indeed random. If the boards are really
        // random, the change of getting the same solution more than once is very
        // small. Not zero though.
        expect(previousBoards).not.toContain(res.data);
        previousBoards.push(res.data);
      });
    });
  }
});

const delayMs = ms => new Promise(resolve => setTimeout(resolve, ms));
