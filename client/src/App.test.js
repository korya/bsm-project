import React from 'react';
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme';
import App from './App';
import Board from './components/Board';
import BoardSpinner from './components/BoardSpinner';
import Button from './components/Button';

describe('initial load', () => {
  let wrapper = null;
  let resolveBoard = null;

  beforeAll(() => {
    jest.spyOn(global, 'fetch')
      .mockImplementation(() => ({
        then: () => ({
          then: cb => {
            resolveBoard = cb;
          },
        }),
      }));
    wrapper = mount(<App />);
  });
  afterAll(() => {
    global.fetch.mockClear();
  });

  test('renders spinner on intial load', () => {
    expect(wrapper.exists(BoardSpinner)).toEqual(true);
    expect(wrapper.exists(Board)).toEqual(false);
  });

  test('attempts to load a board on initial load', () => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/sudoku/board');
  });

  test('display the board when loaded', () => {
    act(() => {
      resolveBoard([1, 2]);
    });
    // XXX It seems to be a bug in enzyme, after useEffect() is finished
    // the HTML code is updated but the ReactWrapper is not.
    // So I have to manually re-render it in order to sync both.
    wrapper.update();
    expect(wrapper.exists(BoardSpinner)).toEqual(false);
    expect(wrapper.exists(Board)).toEqual(true);
    expect(wrapper.find(Board).prop('board')).toEqual([1, 2]);
  });
});

describe('Reload button', () => {
  let wrapper = null;
  let resolveBoard = null;

  beforeAll(() => {
    jest.spyOn(global, 'fetch')
      .mockImplementationOnce(() => ({
        then: () => ({
          then: cb => {
            cb([1, 2]);
          },
        }),
      }))
      .mockImplementation(() => ({
        then: () => ({
          then: cb => {
            resolveBoard = cb;
          },
        }),
      }));
    wrapper = mount(<App />);
  });
  afterAll(() => {
    global.fetch.mockClear();
  });

  test('initial board is loaded', () => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/sudoku/board');
    expect(wrapper.exists(BoardSpinner)).toEqual(false);
    expect(wrapper.exists(Board)).toEqual(true);
    expect(wrapper.find(Board).prop('board')).toEqual([1, 2]);
  });

  test('', () => {
  });

  test('reloads the board when Reload is clicked', () => {
    act(() => {
      wrapper.find(Button).simulate('click');
    });
    // XXX It seems to be a bug in enzyme, after useEffect() is finished
    // the HTML code is updated but the ReactWrapper is not.
    // So I have to manually re-render it in order to sync both.
    wrapper.update();
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith('/sudoku/board');
    expect(wrapper.exists(BoardSpinner)).toEqual(true);
    expect(wrapper.exists(Board)).toEqual(false);
  });

  test('refreshes the board when loaded', async () => {
    act(() => {
      resolveBoard([3, 4, 5]);
    });
    // XXX It seems to be a bug in enzyme, after useEffect() is finished
    // the HTML code is updated but the ReactWrapper is not.
    // So I have to manually re-render it in order to sync both.
    wrapper.update();
    expect(wrapper.exists(BoardSpinner)).toEqual(false);
    expect(wrapper.exists(Board)).toEqual(true);
    expect(wrapper.find(Board).prop('board')).toEqual([3, 4, 5]);
  });
});
