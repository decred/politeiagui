import CryptoJS from "crypto-js";
import invert from "lodash/fp/invert";

const RECORD_STATE_UNVETTED = 1;
const RECORD_STATE_VETTED = 2;

// Core Utils
export const utoa = (str) => window.btoa(unescape(encodeURIComponent(str)));

// Copied from https://stackoverflow.com/a/21797381
export const base64ToArrayBuffer = (base64) => {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

// Copied from https://stackoverflow.com/a/33918579
export const arrayBufferToWordArray = (ab) => {
  const i8a = new Uint8Array(ab);
  const a = [];
  for (let i = 0; i < i8a.length; i += 4) {
    // eslint-disable-next-line
    a.push(
      (i8a[i] << 24) | (i8a[i + 1] << 16) | (i8a[i + 2] << 8) | i8a[i + 3]
    );
  }
  return CryptoJS.lib.WordArray.create(a, i8a.length);
};

export const digestPayload = (payload) =>
  CryptoJS.SHA256(
    arrayBufferToWordArray(base64ToArrayBuffer(payload))
  ).toString(CryptoJS.enc.Hex);

export const objectToBuffer = (obj) => Buffer.from(JSON.stringify(obj));

export const bufferToBase64String = (buf) => buf.toString("base64");

export const objectToSHA256 = (obj) => {
  const buffer = objectToBuffer(obj);
  const base64 = bufferToBase64String(buffer);
  return digestPayload(base64);
};

export const getIndexMdFromText = (text = "") => ({
  name: "index.md",
  mime: "text/plain; charset=utf-8",
  payload: utoa(text)
});

// Record Utils
const RECORD_STATE_LABEL_MAP = {
  [RECORD_STATE_UNVETTED]: "unvetted",
  [RECORD_STATE_VETTED]: "vetted"
};

export function stateToString(state) {
  return RECORD_STATE_LABEL_MAP[state];
}

export function stringToState(string) {
  return invert(RECORD_STATE_LABEL_MAP)[string];
}
