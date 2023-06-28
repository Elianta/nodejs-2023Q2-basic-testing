import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    expect(simpleCalculator({ a: 20, b: 100, action: Action.Add })).toBe(120);
  });

  test('should subtract two numbers', () => {
    expect(simpleCalculator({ a: 20, b: 1, action: Action.Subtract })).toBe(19);
  });

  test('should multiply two numbers', () => {
    expect(simpleCalculator({ a: 13, b: 2, action: Action.Multiply })).toBe(26);
  });

  test('should divide two numbers', () => {
    expect(simpleCalculator({ a: 45, b: 5, action: Action.Divide })).toBe(9);
  });

  test('should exponentiate two numbers', () => {
    expect(simpleCalculator({ a: 4, b: 2, action: Action.Exponentiate })).toBe(
      16,
    );
  });

  test('should return null for invalid action', () => {
    expect(simpleCalculator({ a: 1, b: 2, action: '**' })).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    expect(
      simpleCalculator({ a: 1, b: 'string', action: Action.Add }),
    ).toBeNull();
  });
});
