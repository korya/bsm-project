import React from 'react';
import renderer from 'react-test-renderer';
import Cell from './Cell';

test('renders correctly', () => {
  expect(
    renderer.create(<Cell number={1} />).toJSON(),
  ).toMatchSnapshot();
  expect(
    renderer.create(<Cell number={9}/>).toJSON(),
  ).toMatchSnapshot();
});
