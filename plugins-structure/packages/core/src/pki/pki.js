import localforage from "localforage";
import nacl from "tweetnacl";
import { getStorageKey, toHex } from "./utils";

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
