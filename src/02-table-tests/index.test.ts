import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 20, b: 100, action: Action.Add, expected: 120 },
  { a: 20, b: 1, action: Action.Subtract, expected: 19 },
  { a: 13, b: 2, action: Action.Multiply, expected: 26 },
  { a: 45, b: 5, action: Action.Divide, expected: 9 },
  { a: 4, b: 2, action: Action.Exponentiate, expected: 16 },
  { a: 1, b: 2, action: '**', expected: null },
  { a: 1, b: 'string', action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)('$action($a, $b)', ({ a, b, action, expected }) => {
    expect(simpleCalculator({ a, b, action })).toBe(expected);
  });
});
