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
  "@politeiagui/core/records/utils",
  () => ({
    getTokensToFetch: () => ({
      tokens: ["token1", "token2", "token3", "token4", "token5"],
      last: "token5",
    }),
  }),
  { virtual: true }
);
jest.mock(
  "@politeiagui/core/records/validation",
  () => ({
    validateRecordsPageSize: () => true,
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
