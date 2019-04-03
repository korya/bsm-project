import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import BoardSpinner from './BoardSpinner';
import Spinner from './Spinner';

test('renders correctly', () => {
  expect(
    renderer.create(<BoardSpinner />).toJSON(),
  ).toMatchSnapshot();
});

test('renders Spinner', () => {
  const wrapper = shallow(<BoardSpinner />);
  expect(wrapper.find(Spinner)).toBeDefined();
});
