import {
  BankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
  getBankAccount,
} from '.';
import lodash from 'lodash';

const INITIAL_BALANCE = 1000;

describe('BankAccount', () => {
  let account: BankAccount;
  beforeEach(() => {
    jest.clearAllMocks();
    account = getBankAccount(INITIAL_BALANCE);
  });

  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(INITIAL_BALANCE);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(INITIAL_BALANCE + 1)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const account2 = getBankAccount(INITIAL_BALANCE);
    expect(() => account.transfer(INITIAL_BALANCE + 1, account2)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(INITIAL_BALANCE, account)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const amount = 100;
    account.deposit(amount);
    expect(account.getBalance()).toBe(INITIAL_BALANCE + amount);
  });

  test('should withdraw money', () => {
    const amount = 100;
    account.withdraw(amount);
    expect(account.getBalance()).toBe(INITIAL_BALANCE - amount);
  });

  test('should transfer money', () => {
    const amount = 100;
    const account2 = getBankAccount(INITIAL_BALANCE);
    account.transfer(amount, account2);
    expect(account.getBalance()).toBe(INITIAL_BALANCE - amount);
    expect(account2.getBalance()).toBe(INITIAL_BALANCE + amount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const fetchedBalance = 100;
    jest
      .spyOn(lodash, 'random')
      .mockReturnValueOnce(fetchedBalance)
      .mockReturnValueOnce(1);

    const balance = await account.fetchBalance();
    expect(balance).toBe(fetchedBalance);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const fetchedBalance = 100;
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(fetchedBalance);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(fetchedBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
