import localforage from "localforage";
import nacl from "tweetnacl";
import util from "tweetnacl-util";
import get from "lodash/fp/get";

export const STORAGE_PREFIX = "ed255191~";
export const IDENTITY_ERROR =
  "User identity not found. You need to restore it from a backup or generate a new one. If this is a verification from an emailed link, please ensure to open it in the same browser where you requested it.";

export const toHex = (x) => Buffer.from(toUint8Array(x)).toString("hex");

export const toByteArray = (str) => {
  const bytes = new Uint8Array(Math.ceil(str.length / 2));
  for (let i = 0; i < bytes.length; i++)
    bytes[i] = parseInt(str.substr(i * 2, 2), 16);
  return bytes;
};

export const toUint8Array = (obj) =>
  Object.prototype.toString.call(obj) !== "[object Object]"
    ? obj
    : Uint8Array.from(Object.keys(obj).map((key) => obj[key]));

export const loadKeys = (uuid, keys) =>
  localforage.setItem(STORAGE_PREFIX + uuid, keys).then(() => keys);
export const removeKeys = (uuid) =>
  localforage.removeItem(STORAGE_PREFIX + uuid);
export const generateKeys = () => Promise.resolve(nacl.sign.keyPair());
export const existing = (uuid) =>
  localforage.getItem(STORAGE_PREFIX + uuid).catch((e) => console.warn(e));
const myKeyPair = (uuid) =>
  existing(uuid).then((res) => res && res.secretKey && res);
export const myPublicKey = (uuid) => myKeyPair(uuid).then(get("publicKey"));
export const myPubKeyHex = (uuid) =>
  myPublicKey(uuid)
    .then((keys) => toHex(keys))
    .catch(() => {
      throw new Error(IDENTITY_ERROR);
    });
export const sign = (uuid, msg) =>
  myKeyPair(uuid)
    .then(({ secretKey }) =>
      nacl.sign.detached(toUint8Array(msg), toUint8Array(secretKey))
    )
    .catch(() => {
      throw new Error(IDENTITY_ERROR);
    });
export const signString = (uuid, msg) => sign(uuid, util.decodeUTF8(msg));
export const signHex = (uuid, msg) => sign(uuid, msg).then(toHex);
export const signStringHex = (uuid, msg) => signString(uuid, msg).then(toHex);
export const verify = (msg, sig, pubKey) =>
  nacl.sign.detached.verify(
    toUint8Array(msg),
    toUint8Array(sig),
    toUint8Array(pubKey)
  );

export const verifyKeyPair = (keys) => {
  const msg = util.decodeUTF8("any");
  const { publicKey, secretKey } = keysFromHex(keys);
  const signature = nacl.sign.detached(
    toUint8Array(msg),
    toUint8Array(secretKey)
  );
  return verify(msg, signature, publicKey);
};

export const keysToHex = ({ publicKey, secretKey }) => ({
  publicKey: toHex(publicKey),
  secretKey: toHex(secretKey)
});

const keysFromHex = ({ publicKey, secretKey }) => ({
  publicKey: toByteArray(publicKey),
  secretKey: toByteArray(secretKey)
});

export const getKeys = (uuid) =>
  myKeyPair(uuid).then((keys) => (keys ? keysToHex(keys) : keys));

export const importKeys = (uuid, keys) =>
  Promise.resolve(keysFromHex(keys)).then((decodedKeys) =>
    loadKeys(uuid, decodedKeys)
  );

// The key that we check for replacement are:
// Email for older identities in pi.
// Username for newly created accounts.
export const needStorageKeyReplace = (email, username) =>
  localforage.keys().then((keys) => {
    if (keys.includes(STORAGE_PREFIX + email)) {
      return email;
    }
    if (keys.includes(STORAGE_PREFIX + username)) {
      return username;
    }
    return null;
  });
export const replaceStorageKey = (oldKey, newKey) =>
  myKeyPair(oldKey).then((keys) =>
    loadKeys(newKey, keys).then(() =>
      localforage.removeItem(STORAGE_PREFIX + oldKey)
    )
  );
