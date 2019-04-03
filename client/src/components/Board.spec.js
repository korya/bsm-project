import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Board from './Board';
import Cell from './Cell';

describe('renders correctly', () => {
  test('no selected cells', () => {
    const b = getTestBoard();
    const s = b.map(() => false);
    expect(
      renderer.create(
        <Board board={b} selected={s} />
      ).toJSON(),
    ).toMatchSnapshot();
  });

  test('with selected cells', () => {
    const b = getTestBoard();
    const s = b.map(() => false);
    s[1] = true;
    s[56] = true;
    s[80] = true;
    expect(
      renderer.create(
        <Board board={b} selected={s} />
      ).toJSON(),
    ).toMatchSnapshot();
  });
});

test('renders Cells', () => {
  const b = getTestBoard();
  const s = b.map(() => false);
  s[0] = true;
  s[2] = true;
  s[56] = true;
  s[80] = true;

  const wrapper = shallow(<Board board={b} selected={s} />);
  expect(
    wrapper.find(Cell).map(node => node.prop('number')),
  ).toEqual(b);
  expect(
    wrapper.find(Cell).map(node => node.prop('selected')),
  ).toEqual(s);
});

test('calls onCellClick prop handler', () => {
  const clickHandler = jest.fn();
  const b = getTestBoard();
  const s = b.map(() => false);
  const wrapper = shallow(
    <Board board={b} selected={s} onCellClick={clickHandler} />
  );
  wrapper.find(Cell).find({ number: 112 }).simulate('click');
  expect(clickHandler).toHaveBeenCalledTimes(1);
  expect(clickHandler).toHaveBeenCalledWith(12);
});

// A board is not valid, it contains 100+index in every cell. But it is
// very handy for testing.
const getTestBoard = () => Array.from({ length: 81 }).map((n, idx) => 100+idx);
