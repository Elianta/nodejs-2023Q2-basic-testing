import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import path from 'path';
import fs from 'fs';
import fsp from 'fs/promises';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(global, 'setTimeout');
  });

  test('should set timeout with provided callback and timeout', () => {
    const cb = jest.fn();
    const timeout = 100;
    doStuffByTimeout(cb, timeout);
    expect(setTimeout).toBeCalledWith(cb, timeout);
  });

  test('should call callback only after timeout', () => {
    const cb = jest.fn();
    const timeout = 200;
    doStuffByTimeout(cb, timeout);
    expect(cb).not.toBeCalled();
    jest.advanceTimersByTime(timeout);
    expect(cb).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(global, 'setInterval');
  });

  test('should set interval with provided callback and timeout', () => {
    const cb = jest.fn();
    const interval = 100;
    doStuffByInterval(cb, interval);
    expect(setInterval).toBeCalledWith(cb, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const cb = jest.fn();
    const interval = 200;
    doStuffByInterval(cb, interval);
    expect(cb).not.toBeCalled();
    jest.runOnlyPendingTimers();
    expect(cb).toHaveBeenCalledTimes(1);
    jest.runOnlyPendingTimers();
    expect(cb).toHaveBeenCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call join with pathToFile', async () => {
    const spy = jest.spyOn(path, 'join');
    const pathToFile = 'path.txt';
    await readFileAsynchronously(pathToFile);
    expect(spy).toHaveBeenCalledWith(expect.any(String), pathToFile);
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const pathToFile = 'path.txt';
    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const fileContent = Buffer.from('file content');
    jest.spyOn(fsp, 'readFile').mockResolvedValue(fileContent);

    const pathToFile = 'path.txt';
    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBe(fileContent.toString());
  });
});
