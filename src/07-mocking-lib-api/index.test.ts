import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('lodash', () => {
  const originalModule = jest.requireActual('lodash');

  return {
    __esModule: true,
    ...originalModule,
    throttle: jest.fn((fn) => fn),
  };
});

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue({ data: 'data' });
    mockedAxios.create.mockReturnValue({
      get: mockedAxios.get,
    } as unknown as AxiosInstance);
  });

  test('should create instance with provided base url', async () => {
    const axiosCreateSpy = jest.spyOn(axios, 'create');

    const relativePath = 'relative-path';
    await throttledGetDataFromApi(relativePath);

    expect(axiosCreateSpy).toBeCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const axiosGetSpy = jest.spyOn(axios, 'get');
    const relativePath = 'relative-path';
    await throttledGetDataFromApi(relativePath);

    expect(axiosGetSpy).toBeCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const relativePath = 'relative-path';
    const data = await throttledGetDataFromApi(relativePath);

    expect(data).toBe('data');
  });
});
