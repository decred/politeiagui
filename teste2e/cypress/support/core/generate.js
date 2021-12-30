import faker from "faker";
import { User } from "../users/generate";
import {
  bufferToBase64String,
  getIndexMdFromText,
  digestPayload,
  objectToBuffer
} from "./utils";
import compose from "lodash/fp/compose";
import entries from "lodash/fp/entries";
import reduce from "lodash/fp/reduce";
import range from "lodash/fp/range";
import map from "lodash/fp/map";
import chunk from "lodash/fp/chunk";
import get from "lodash/fp/get";

// Record
export const Token = (isShort) =>
  faker.git.shortSha().slice(0, isShort ? 7 : 16);

export function Metadata(pluginid, streamid, payload) {
  this.pluginid = pluginid;
  this.streamid = streamid;
  this.payload = JSON.stringify(payload);
}

export function UserMetadata({ userid, publickey, signature }) {
  return new Metadata("usermd", faker.datatype.number(3), {
    userid,
    publickey,
    signature
  });
}

export function RecordMetadata({
  token,
  version,
  status,
  publickey,
  signature,
  timestamp
}) {
  return new Metadata("usermd", faker.datatype.number(3), {
    token,
    version,
    status,
    publickey,
    signature,
    timestamp
  });
}

export const fileImage = {
  name: `image_${faker.name.title()}.png`,
  mime: "image/png",
  payload: bufferToBase64String(faker.image.image())
};

export const fileIndex = getIndexMdFromText(
  `# ${faker.name.title()}\n\n${faker.lorem.paragraphs()}`
);

export function fileJson({ name, object }) {
  return {
    name,
    mime: "text/plain; charset=utf-8",
    payload: bufferToBase64String(objectToBuffer(object))
  };
}

export function File({ name, mime, payload }) {
  this.name = name;
  this.mime = mime;
  this.payload = payload;
  this.digest = digestPayload(payload);
}

/**
 * Record instantiates a new Record structure customizeable by the recordProps
 * parameter.
 * @param {Object} { author, token, status, state, vesion, files }
 */
export function Record({
  author,
  token: recordToken,
  status: recordStatus,
  state: recordState,
  version: recordVersion,
  publickey,
  signature: recordSignature = faker.datatype.hexaDecimal(
    128,
    false,
    /[0-9a-z]/
  ),
  files = []
} = {}) {
  const token = recordToken || Token();
  const status = recordStatus || faker.datatype.number(3) + 1;
  const state = recordState || faker.datatype.number(1) + 1;
  const user = author || new User();
  const timestamp = Date.now() / 1000;
  const version = recordVersion || faker.datatype.number(6) + 1;
  const signature = faker.datatype.hexaDecimal(128, false, /[0-9a-z]/);

  this.status = status;
  this.state = state;
  this.timestamp = timestamp;
  this.username = user.username;
  this.version = version;
  this.censorshiprecord = {
    token,
    signature,
    merkle: faker.datatype.hexaDecimal(64, false, /[0-9a-z]/)
  };
  if (files.length >= 2) {
    this.files = files;
  } else {
    this.files = [new File(fileIndex), ...files.map((f) => new File(f))];
  }
  this.metadata = [
    UserMetadata(user),
    RecordMetadata({
      token,
      version,
      status,
      publickey: publickey || user.publickey,
      signature: recordSignature,
      timestamp
    })
  ];
}

/**
 * Inventory returns a new inventory map with random tokens according to
 * the amountByStatus ({ [status]: amount }) object.
 * @param { Object } amountByStatus
 * @param { Object } { pageLimit, page }
 */
export function Inventory(amountByStatus = {}, { pageLimit = 20, page = 1 }) {
  return compose(
    reduce(
      (acc, [status, amount]) => ({
        ...acc,
        [status]: compose(
          get(page - 1),
          chunk(pageLimit),
          map(() => Token()),
          range(amount)
        )(0)
      }),
      {}
    ),
    entries
  )(amountByStatus);
}
