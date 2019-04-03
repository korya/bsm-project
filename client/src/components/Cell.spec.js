import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Cell from './Cell';

test('renders correctly', () => {
  expect(
    renderer.create(<Cell number={1} />).toJSON(),
  ).toMatchSnapshot();
  expect(
    renderer.create(<Cell number={9} />).toJSON(),
  ).toMatchSnapshot();
  expect(
    renderer.create(<Cell selected={true} number={7} />).toJSON(),
  ).toMatchSnapshot();
});

test('calls onClick prop handler', () => {
  const clickHandler = jest.fn();
  const wrapper = shallow(<Cell onClick={clickHandler} />);
  wrapper.find('button').simulate('click');
  expect(clickHandler).toHaveBeenCalledTimes(1);
});
