// Universal mocks
jest.mock(
  "@politeiagui/core/client",
  () => ({
    getCsrf: () => jest.fn(),
    parseResponse: () => jest.fn(),
    fetchOptions: () => jest.fn(),
  }),
  { virtual: true }
);
jest.mock(
  "@politeiagui/core/records",
  () => ({
    records: {
      fetch: () => jest.fn(),
    },
  }),
  { virtual: true }
);

jest.mock(
  "@politeiagui/core",
  () => ({
    RECORDS_PAGE_SIZE: 5,
  }),
  { virtual: true }
);
