// Core Mocks
jest.mock(
  "@politeiagui/core/records/utils",
  () => ({
    decodeRecordMetadata: () => jest.fn(),
  }),
  { virtual: true }
);
jest.mock(
  "@politeiagui/core/records/constants",
  () => ({
    RECORD_STATUS_UNREVIEWED: 1,
    RECORD_STATUS_PUBLIC: 2,
    RECORD_STATUS_CENSORED: 3,
    RECORD_STATUS_ARCHIVED: 4,
  }),
  { virtual: true }
);
//
jest.mock(
  "@politeiagui/ticketvote/constants",
  () => ({
    TICKETVOTE_STATUS_UNAUTHORIZED: 1,
    TICKETVOTE_STATUS_AUTHORIZED: 2,
    TICKETVOTE_STATUS_STARTED: 3,
    TICKETVOTE_STATUS_FINISHED: 4,
    TICKETVOTE_STATUS_APPROVED: 5,
    TICKETVOTE_STATUS_REJECTED: 6,
  }),
  { virtual: true }
);
