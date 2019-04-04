const {
  createEmptyBoard,
  boardIsSolved,
  boardIsSolveable,
  segmentsHasDups,
  segmentIsSolved,
  getPosForIdx,
  iterateRow,
  iterateCol,
  iterateBox,
} = require('./board');

describe('getPosForIdx', () => {
  const cases = [
    // First box
    [ 0, { row: 0, col: 0, box: [0, 0] }],
    [ 2, { row: 0, col: 2, box: [0, 0] }],
    [20, { row: 2, col: 2, box: [0, 0] }],
    // Second box
    [ 4, { row: 0, col: 4, box: [0, 3] }],
    [14, { row: 1, col: 5, box: [0, 3] }],
    [21, { row: 2, col: 3, box: [0, 3] }],
    // Fifth box
    [30, { row: 3, col: 3, box: [3, 3] }],
    [49, { row: 5, col: 4, box: [3, 3] }],
    // Sixth box
    [42, { row: 4, col: 6, box: [3, 6] }],
    // Seventh box
    [56, { row: 6, col: 2, box: [6, 0] }],
    [72, { row: 8, col: 0, box: [6, 0] }],
    // Ninth box
    [60, { row: 6, col: 6, box: [6, 6] }],
    [80, { row: 8, col: 8, box: [6, 6] }],
  ];

  test.each(cases)('idx=%s', (idx, expected) => {
    expect(getPosForIdx(idx)).toEqual(expected);
  });
});

describe('iterateRow', () => {
  const cases = [
    [0, [ 0,  1,  2,  3,  4,  5,  6,  7,  8]],
    [3, [27, 28, 29, 30, 31, 32, 33, 34, 35]],
    [8, [72, 73, 74, 75, 76, 77, 78, 79, 80]],
  ];

  test.each(cases)('row=%s', (row, expected) => {
    expect(Array.from(iterateRow(row))).toEqual(expected);
  });
});

describe('iterateCol', () => {
  const cases = [
    [0, [ 0,  9, 18, 27, 36, 45, 54, 63, 72]],
    [3, [ 3, 12, 21, 30, 39, 48, 57, 66, 75]],
    [8, [ 8, 17, 26, 35, 44, 53, 62, 71, 80]],
  ];

  test.each(cases)('col=%s', (col, expected) => {
    expect(Array.from(iterateCol(col))).toEqual(expected);
  });
});

describe('iterateBox', () => {
  const cases = [
    [0, 0, [ 0,  1,  2,  9, 10, 11, 18, 19, 20]],
    [0, 3, [ 3,  4,  5, 12, 13, 14, 21, 22, 23]],
    [3, 6, [33, 34, 35, 42, 43, 44, 51, 52, 53]],
    [6, 6, [60, 61, 62, 69, 70, 71, 78, 79, 80]],
  ];

  test.each(cases)('top-left=(%s, %s)', (topLeftRow, topLeftCol, expected) => {
    expect(
      Array.from(iterateBox([topLeftRow, topLeftCol])),
    ).toEqual(expected);
  });
});

describe('segmentsHasDups', () => {
  test('empty board', () => {
    expect(
      segmentsHasDups([0, 0, 0, 0, 0], [0, 1, 2, 3, 4]),
    ).toEqual(false);
  });

  test('no conflict board', () => {
    expect(
      segmentsHasDups([1, 0, 2, 0, 3], [0, 1, 2, 3, 4]),
    ).toEqual(false);
  });

  test('full no conflict board', () => {
    expect(
      segmentsHasDups([1, 2, 3, 4, 5], [0, 1, 2, 3, 4]),
    ).toEqual(false);
  });

  test('conflict board', () => {
    expect(
      segmentsHasDups([1, 2, 3, 4, 1], [0, 1, 2, 3, 4]),
    ).toEqual(true);
  });

  test('no conflict segment', () => {
    expect(
      segmentsHasDups([1, 0, 1, 0, 1], [1, 2, 3]),
    ).toEqual(false);
  });

  test('full no conflict segment', () => {
    expect(
      segmentsHasDups([1, 1, 2, 3, 2], [1, 2, 3]),
    ).toEqual(false);
  });

  test('conflict segment', () => {
    expect(
      segmentsHasDups([1, 0, 1, 0, 1], [0, 1, 2]),
    ).toEqual(true);
  });
});

describe('segmentIsSolved', () => {
  test('empty board', () => {
    const emptyBoard = Array.from({ length: 81 }).map(() => 0);
    const firstRow = Array.from({ length: 9 }).map((_, idx) => idx);
    const thirdCol = Array.from({ length: 9 }).map((_, idx) => 2 + idx * 9);

    expect(segmentIsSolved(emptyBoard, firstRow)).toEqual(false);
    expect(segmentIsSolved(emptyBoard, thirdCol)).toEqual(false);
  });

  const sampleBoard = [
    1, 2, 3,   4, 5, 6,   7, 8, 9,
    4, 5, 6,   7, 8, 9,   1, 0, 3,
    7, 8, 9,   1, 2, 1,   2, 0, 4,
  ];
  const solvedRowSegment = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // first row
  const solvedBoxSegment = [0, 1, 2, 9, 10, 11, 18, 19, 20]; // first box
  const dupBoxSegment = [3, 4, 5, 12, 13, 14, 21, 22, 23]; // second box
  const partialRowSegment = [9, 10, 11, 12, 13, 14, 15, 16, 17]; // second row
  const partialBoxSegment = [6, 7, 8, 15, 16, 17, 24, 25, 26]; // third box
  const invalidRowSegment = [18, 19, 20, 21, 22, 23, 24, 25, 26]; // third row

  test('solved', () => {
    expect(segmentIsSolved(sampleBoard, solvedRowSegment)).toEqual(true);
    expect(segmentIsSolved(sampleBoard, solvedBoxSegment)).toEqual(true);
  });

  test('duplicates', () => {
    expect(segmentIsSolved(sampleBoard, dupBoxSegment)).toEqual(false);
  });

  test('missing cells', () => {
    expect(segmentIsSolved(sampleBoard, partialRowSegment)).toEqual(false);
    expect(segmentIsSolved(sampleBoard, partialBoxSegment)).toEqual(false);
  });

  test('not solved', () => {
    expect(segmentIsSolved(sampleBoard, invalidRowSegment)).toEqual(false);
    expect(segmentIsSolved(sampleBoard, [1, 2, 3])).toEqual(false);
  });
});

describe('boardIsSolved', () => {
  describe('solved', () => {
    test.each(getValidBoards())('solved: %s', (name, board) => {
      expect(boardIsSolved(board)).toEqual(true);
    });
  });

  describe('not solved', () => {
    test('missing value', () => {
      const b = getTrivialBoard();
      expect(boardIsSolved(b)).toEqual(true);
      b[53] = 0;
      expect(boardIsSolved(b)).toEqual(false);
    });

    test('row dups', () => {
      const b = getTrivialBoard();
      expect(boardIsSolved(b)).toEqual(true);
      b[0] = b[1];
      expect(boardIsSolved(b)).toEqual(false);
    });

    test('col dups', () => {
      const b = getTrivialBoard();
      expect(boardIsSolved(b)).toEqual(true);
      b[80] = b[71];
      expect(boardIsSolved(b)).toEqual(false);
    });

    test('invalid box', () => {
      const b = getTrivialBoard();
      expect(boardIsSolved(b)).toEqual(true);
      // swap 3rd row and 4th row
      for (let idx = 18; idx < 27; idx++) {
        [b[idx], b[idx + 9]] = [b[idx + 9], b[idx]];
      }
      expect(boardIsSolved(b)).toEqual(false);
    });
  });

  describe('bad input', () => {
    const cases = [
      undefined,
      null,
      '',
      'string',
      1,
      2.3,
      {},
      { length: 81 },
      [],
      getTrivialBoard().slice(0, 75),
      [...getTrivialBoard(), ...[0]],
    ];

    test.each(cases)('%s', val => {
      expect(boardIsSolved(val)).toEqual(false);
    });
  });
});

describe('boardIsSolveable', () => {
  describe('solved', () => {
    test.each(getValidBoards())('solved: %s', (name, board) => {
      expect(boardIsSolveable(board)).toEqual(true);
    });
  });

  describe('solveable', () => {
    test('missing value', () => {
      const b = getTrivialBoard();
      expect(boardIsSolveable(b)).toEqual(true);
      b[53] = 0;
      expect(boardIsSolveable(b)).toEqual(true);
    });

    test('missing row', () => {
      const b = getTrivialBoard();
      expect(boardIsSolveable(b)).toEqual(true);
      // clear 5th row
      for (let idx = 36; idx < 45; idx++) {
        b[idx] = 0;
      }
      expect(boardIsSolveable(b)).toEqual(true);
    });

    test('missing col', () => {
      const b = getTrivialBoard();
      expect(boardIsSolveable(b)).toEqual(true);
      // clear 7th col
      for (let idx = 6; idx < 81; idx += 9) {
        b[idx] = 0;
      }
      expect(boardIsSolveable(b)).toEqual(true);
    });

    test('almost empty board', () => {
      const b = createEmptyBoard();
      b[80] = 1;
      expect(boardIsSolveable(b)).toEqual(true);
    });

    test('empty board', () => {
      const b = createEmptyBoard();
      expect(boardIsSolveable(b)).toEqual(true);
    });
  });

  describe('unsolveable', () => {
    test('row dups', () => {
      const b = getTrivialBoard();
      expect(boardIsSolveable(b)).toEqual(true);
      b[0] = b[1];
      expect(boardIsSolveable(b)).toEqual(false);
    });

    test('col dups', () => {
      const b = getTrivialBoard();
      expect(boardIsSolveable(b)).toEqual(true);
      b[80] = b[71];
      expect(boardIsSolveable(b)).toEqual(false);
    });

    test('invalid box', () => {
      const b = getTrivialBoard();
      expect(boardIsSolveable(b)).toEqual(true);
      // swap 3rd row and 4th row
      for (let idx = 18; idx < 27; idx++) {
        [b[idx], b[idx + 9]] = [b[idx + 9], b[idx]];
      }
      expect(boardIsSolveable(b)).toEqual(false);
    });

    test('sparse col dups', () => {
      const b = createEmptyBoard();
      b[8] = 3;
      b[80] = 3;
      expect(boardIsSolveable(b)).toEqual(false);
    });

    test('sparse row dups', () => {
      const b = createEmptyBoard();
      b[19] = 5;
      b[26] = 5;
      expect(boardIsSolveable(b)).toEqual(false);
    });

    test('sparse box dups', () => {
      const b = createEmptyBoard();
      b[10] = 2;
      b[20] = 2;
      expect(boardIsSolveable(b)).toEqual(false);
    });
  });

  describe('bad input', () => {
    const cases = [
      undefined,
      null,
      '',
      'string',
      1,
      2.3,
      {},
      { length: 81 },
      [],
      getTrivialBoard().slice(0, 75),
      [...getTrivialBoard(), ...[0]],
    ];

    test.each(cases)('%s', val => {
      expect(boardIsSolveable(val)).toEqual(false);
    });
  });
});

function getTrivialBoard() {
  return [
    1,2,3,4,5,6,7,8,9,
    4,5,6,7,8,9,1,2,3,
    7,8,9,1,2,3,4,5,6,
    2,1,4,3,6,5,8,9,7,
    3,6,5,8,9,7,2,1,4,
    8,9,7,2,1,4,3,6,5,
    5,3,1,6,4,2,9,7,8,
    6,4,2,9,7,8,5,3,1,
    9,7,8,5,3,1,6,4,2,
  ];
}

function getValidBoards() {
  return [
    [
      'trivial',
      getTrivialBoard(),
    ],
    [
      'one',
      [3,2,5,7,1,8,6,4,9,1,4,8,3,6,9,2,7,5,9,6,7,2,5,4,3,1,8,6,1,4,5,8,2,9,3,7,7,3,2,4,9,1,8,5,6,8,5,9,6,3,7,1,2,4,5,8,1,9,7,3,4,6,2,4,9,6,1,2,5,7,8,3,2,7,3,8,4,6,5,9,1],
    ],
    [
      'two',
      [8,2,4,1,6,3,5,7,9,1,5,6,8,9,7,4,2,3,3,7,9,2,4,5,8,6,1,6,9,5,3,8,1,2,4,7,2,8,1,4,7,6,9,3,5,4,3,7,5,2,9,1,8,6,7,1,8,9,3,2,6,5,4,5,6,2,7,1,4,3,9,8,9,4,3,6,5,8,7,1,2],
    ],
    [
      'three',
      [6,5,1,2,9,8,4,7,3,3,7,2,4,6,1,9,8,5,4,9,8,7,3,5,6,2,1,1,6,3,8,2,7,5,4,9,2,8,5,6,4,9,1,3,7,9,4,7,5,1,3,2,6,8,8,1,4,9,7,2,3,5,6,5,2,9,3,8,6,7,1,4,7,3,6,1,5,4,8,9,2],
    ],
  ];
}
