import React from 'react';
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme';
import App from './App';
import Board from './components/Board';
import BoardSpinner from './components/BoardSpinner';
import Button from './components/Button';
import Cell from './components/Cell';

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

  test('no selected cells', () => {
    expect(
      wrapper.find(Cell).find({ selected: true }).exists(),
    ).toEqual(false);
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
    expect(
      wrapper.find(Cell).find({ selected: true }).exists(),
    ).toEqual(false);
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
    expect(
      wrapper.find(Cell).find({ selected: true }).exists(),
    ).toEqual(false);
  });
});

describe('select cells', () => {
  let wrapper = null;

  beforeAll(() => {
    jest.spyOn(global, 'fetch')
      .mockImplementationOnce(() => ({
        then: () => ({
          then: cb => {
            cb([1, 2, 3, 4, 5]);
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
    expect(wrapper.find(Board).prop('board')).toEqual([1, 2, 3, 4, 5]);
    expect(
      wrapper.find(Cell).find({ selected: true }).exists(),
    ).toEqual(false);
  });

  test('selected cell is highlighted', () => {
    act(() => {
      wrapper.find(Cell).find({ number: 4 }).find('button').simulate('click');
    });
    // XXX It seems to be a bug in enzyme, after useEffect() is finished
    // the HTML code is updated but the ReactWrapper is not.
    // So I have to manually re-render it in order to sync both.
    wrapper.update();
    const selectedCells = wrapper.find(Cell).find({ selected: true });
    expect(selectedCells.exists()).toEqual(true);
    expect(selectedCells.map(n => n.prop('number'))).toEqual([4])
  });

  test('multiple selected cells are highlighted', () => {
    act(() => {
      wrapper.find(Cell).find({ number: 1 }).find('button').simulate('click');
    });
    // XXX It seems to be a bug in enzyme, after useEffect() is finished
    // the HTML code is updated but the ReactWrapper is not.
    // So I have to manually re-render it in order to sync both.
    wrapper.update();
    const selectedCells = wrapper.find(Cell).find({ selected: true });
    expect(selectedCells.exists()).toEqual(true);
    expect(selectedCells.map(n => n.prop('number'))).toEqual([1, 4])
  });

  test('unselected cell is not highlighted', () => {
    act(() => {
      wrapper.find(Cell).find({ number: 4 }).find('button').simulate('click');
    });
    // XXX It seems to be a bug in enzyme, after useEffect() is finished
    // the HTML code is updated but the ReactWrapper is not.
    // So I have to manually re-render it in order to sync both.
    wrapper.update();
    const selectedCells = wrapper.find(Cell).find({ selected: true });
    expect(selectedCells.exists()).toEqual(true);
    expect(selectedCells.map(n => n.prop('number'))).toEqual([1])
  });

  test('board is not refreshed', () => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/sudoku/board');
    expect(wrapper.exists(BoardSpinner)).toEqual(false);
    expect(wrapper.exists(Board)).toEqual(true);
    expect(wrapper.find(Board).prop('board')).toEqual([1, 2, 3, 4, 5]);
  });
});
