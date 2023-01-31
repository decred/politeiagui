import localforage from "localforage";
import nacl from "tweetnacl";
import { getStorageKey, toHex, toUint8Array } from "./utils";

/**
 * generateKeys - Generates a new key pair
 * @returns {Promise} A promise that resolves to the generated key pair
 */
export function generateKeys() {
  return Promise.resolve(nacl.sign.keyPair());
}

/**
 * setKeys - Loads a key pair into local storage
 * @param {String} uuid
 * @param {Object} keys
 * @returns {Promise} A promise that resolves to the loaded key pair
 */
export function setKeys(uuid, keys) {
  return localforage.setItem(getStorageKey(uuid), keys);
}

/**
 * removeKeys - Removes a key pair from local storage
 * @param {String} uuid
 * @returns {Promise} A promise that resolves to the removed key pair
 */
export function removeKeys(uuid) {
  return localforage.removeItem(getStorageKey(uuid));
}

/**
 * generateNewUserPubkeyHex - Generates a new nacl key pair and loads it into
 * local storage. Returns the public key as a hex string.
 * @param {String} username
 * @returns {Promise} A promise that resolves to the public key as a hex string.
 */
export async function generateNewUserPubkeyHex(username) {
  const keys = await generateKeys();
  await setKeys(username, keys);
  return toHex(keys.publicKey);
}

/**
 * sign - Signs a message with the key pair associated with the given uuid
 *
 * @param {String} uuid
 * @param {Object} data
 * @returns {Promise} A promise that resolves to the signed message
 * @throws {Error} If the key pair is not found in local storage
 */
export async function sign(uuid, data) {
  const keys = await localforage.getItem(getStorageKey(uuid));
  return nacl.sign.detached(toUint8Array(data), toUint8Array(keys.secretKey));
}

/**
 * signString - Signs a string with the key pair associated with the given uuid
 *
 * @param {String} uuid
 * @param {String} msg
 * @returns {Promise} A promise that resolves to the signed message as a hex
 * string
 * @throws {Error} If the key pair is not found in local storage
 */
export async function signString(uuid, msg) {
  const encoder = new TextEncoder();
  const sigUint8Array = await sign(uuid, encoder.encode(msg));
  return toHex(sigUint8Array);
}
