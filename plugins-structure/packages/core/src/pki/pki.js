import localforage from "localforage";
import nacl from "tweetnacl";
import { getStorageKey, toByteArray, toHex, toUint8Array } from "./utils";

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
 * @param {{
 *  publicKey: string,
 *  secretKey: string
 * }} keys
 * @returns {Promise} A promise that resolves to the loaded key pair
 */
export async function setKeys(uuid, keys) {
  const { publicKey, secretKey } = keys;
  return await localforage.setItem(getStorageKey(uuid), {
    publicKey: toByteArray(publicKey),
    secretKey: toByteArray(secretKey),
  });
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
 * getCurrentUserPubkeyHex - Returns the public key associated with the given
 * userid.
 * @param {String} userid
 * @returns {Promise} A promise that resolves to the public key as a hex string.
 */
export async function getCurrentUserPubkeyHex(userid) {
  const keys = await localforage.getItem(getStorageKey(userid));
  console.log("current localforage keys", { keys, userid });
  if (!keys) return;
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