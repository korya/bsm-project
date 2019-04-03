import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Board from './Board';
import Cell from './Cell';

test('renders correctly', () => {
  expect(
    renderer.create(<Board board={getTestBoard()} />).toJSON(),
  ).toMatchSnapshot();
});

test('renders Cells', () => {
  const b = getTestBoard();
  const wrapper = shallow(<Board board={b} />);
  expect(
    wrapper.find(Cell).map(node => node.prop('number')),
  ).toEqual(b);
});

// A board is not valid, it contains the cell index in every cell. But it is
// very handy for testing.
const getTestBoard = () => Array.from({ length: 81 }).map((n, idx) => idx);
