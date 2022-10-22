import { faker } from "@faker-js/faker";
import * as ctes from "../../records/constants";

export function recordToken() {
  return faker.random.numeric(16);
}

export function getTokensArray(amount) {
  return Array(amount).fill("").map(recordToken);
}

export function mockRecord({
  state = ctes.RECORD_STATE_VETTED,
  status = ctes.RECORD_STATUS_PUBLIC,
  username = faker.internet.userName(),
  timestamp = Date.now() / 1000,
  userid = faker.datatype.uuid(),
  reason = faker.lorem.words(5),
} = {}) {
  return ({ token = recordToken(), version = 1 }) => ({
    state,
    status,
    username,
    version,
    timestamp,
    censorshiprecord: { token },
    metadata: [
      {
        pluginid: "usermd",
        streamid: 1,
        payload: `{"userid":"${userid}","publickey":"","signature":""}`,
      },
      {
        pluginid: "usermd",
        streamid: 2,
        payload: `{"token":"${token}","version":${
          version - 1
        },"status":2,"publickey":"","signature":"","timestamp":1646761813}`,
      },
      status !== ctes.RECORD_STATUS_CENSORED &&
      status !== ctes.RECORD_STATUS_ARCHIVED
        ? {}
        : {
            pluginid: "usermd",
            streamid: 3,
            payload: `{"token":"${token}","version":${
              version - 1
            },"status":${status},"publickey":"","signature":"","timestamp":1646761813, "reason": "${reason}"}`,
          },
    ],
  });
}

export function mockRecordsBatch(mockRecordFn = mockRecord) {
  return ({ requests }) => {
    const records = requests.reduce((response, request) => {
      const { token, filenames } = request;
      const recordResponse = mockRecordFn({ token, filenames });
      return {
        ...response,
        [token]: recordResponse,
      };
    }, {});
    return { records };
  };
}

export function mockRecordsPolicy({
  recordspagesize = 5,
  inventorypagesize = 20,
} = {}) {
  return () => ({
    recordspagesize,
    inventorypagesize,
  });
}

export function mockRecordTimestamps() {
  return () => ({
    recordmetadata: {
      data: faker.datatype.json(),
      digest: faker.datatype.hexadecimal(64),
      txid: faker.datatype.hexadecimal(64),
      merkleroot: faker.datatype.hexadecimal(64),
      proofs: [],
    },
    metadata: {
      usermd: {
        1: {
          data: faker.datatype.json(),
          digest: faker.datatype.hexadecimal(64),
          txid: faker.datatype.hexadecimal(64),
          merkleroot: faker.datatype.hexadecimal(64),
          proofs: [],
        },
      },
    },
    files: {
      "index.md": {
        data: faker.datatype.json(),
        digest: faker.datatype.hexadecimal(64),
        txid: faker.datatype.hexadecimal(64),
        merkleroot: faker.datatype.hexadecimal(64),
        proofs: [],
      },
      "proposalmetadata.json": {
        data: faker.datatype.json(),
        digest: faker.datatype.hexadecimal(64),
        txid: faker.datatype.hexadecimal(64),
        merkleroot: faker.datatype.hexadecimal(64),
        proofs: [],
      },
    },
  });
}
