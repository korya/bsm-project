const {
  maskGet,
  maskSet,
} = require('./utils');

describe('maskGet', () => {
  const cases = [
    [0x0000,  0, 0],
    [0x0000,  1, 0],
    [0x0000,  3, 0],
    [0x0000,  9, 0],
    [0x0000, 11, 0],
    [0xf00f,  0, 1],
    [0xf00f,  1, 2],
    [0xf00f,  3, 8],
    [0xf00f,  9, 0],
    [0xf00f, 11, 0],
    [0xffff,  0, 1],
    [0xffff,  1, 2],
    [0xffff,  3, 8],
    [0xffff,  9, 512],
    [0xffff, 11, 2048],
  ];

  test.each(cases)('mask=%s, n=%s', (mask, n, expected) => {
    expect(maskGet(mask, n)).toEqual(expected);
  });
});

describe('maskSet', () => {
  const cases = [
    [0x0000,  0, 0x0001],
    [0x0000,  1, 0x0002],
    [0x0000,  3, 0x0008],
    [0x0000,  9, 0x0200],
    [0x0000, 11, 0x0800],
    [0xf00f,  0, 0xf00f],
    [0xf00f,  1, 0xf00f],
    [0xf00f,  3, 0xf00f],
    [0xf00f,  9, 0xf20f],
    [0xf00f, 11, 0xf80f],
    [0xffff,  0, 0xffff],
    [0xffff,  1, 0xffff],
    [0xffff,  3, 0xffff],
    [0xffff,  9, 0xffff],
    [0xffff, 11, 0xffff],
  ];

  test.each(cases)('mask=%s, n=%s', (mask, n, expected) => {
    expect(maskSet(mask, n)).toEqual(expected);
  });
});

describe('shuffleArray', () => {
});
