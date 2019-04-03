import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Button from './Button';

test('renders correctly', () => {
  expect(
    renderer.create(<Button />).toJSON(),
  ).toMatchSnapshot();
  expect(
    renderer.create(<Button onClick={() => {}}>Label</Button>).toJSON(),
  ).toMatchSnapshot();
});

test('renders children correctly', () => {
  const wrapper = shallow(<Button />);
  expect(wrapper.html()).toMatchSnapshot();
});

test('calls onClick prop handler', () => {
  const clickHandler = jest.fn();
  const wrapper = shallow(<Button onClick={clickHandler} />);
  wrapper.find('button').simulate('click');
  expect(clickHandler).toHaveBeenCalledTimes(1);
});
