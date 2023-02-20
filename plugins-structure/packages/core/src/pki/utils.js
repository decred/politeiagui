import { Buffer } from "buffer";

/**
 * STORAGE_PREFIX - Prefix for local forage keys
 */
export const STORAGE_PREFIX = "ed255191~";

/**
 * getStorageKey - Returns the local forage key for a given uuid
 * @param {String} uuid
 * @returns String
 */
export function getStorageKey(uuid) {
  return uuid ? STORAGE_PREFIX + uuid : STORAGE_PREFIX;
}

export function toUint8Array(obj) {
  return Object.prototype.toString.call(obj) !== "[object Object]"
    ? obj
    : Uint8Array.from(Object.keys(obj).map((key) => obj[key]));
}

export function toByteArray(str) {
  const bytes = new Uint8Array(Math.ceil(str.length / 2));
  for (let i = 0; i < bytes.length; i++)
    bytes[i] = parseInt(str.substr(i * 2, 2), 16);
  return bytes;
}

/**
 * toHex - Converts given array, buffer or string to a hex string
 * @param {string | Array | Buffer} data
 * @returns {string} hex
 */
export function toHex(data) {
  return Buffer.from(data).toString("hex");
}
