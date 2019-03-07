import Promise from "promise";
import localforage from "localforage";
import nacl from "tweetnacl";
import util from "tweetnacl-util";
import get from "lodash/fp/get";

export const STORAGE_PREFIX = "ed255191~";
export const toHex = x => Buffer.from(toUint8Array(x)).toString("hex");

export const toByteArray = str => {
  const bytes = new Uint8Array(Math.ceil(str.length / 2));
  for (let i = 0; i < bytes.length; i++)
    bytes[i] = parseInt(str.substr(i * 2, 2), 16);
  return bytes;
};

export const toUint8Array = obj =>
  Object.prototype.toString.call(obj) !== "[object Object]"
    ? obj
    : Uint8Array.from(Object.keys(obj).map(key => obj[key]));

export const loadKeys = (email, keys) =>
  localforage.setItem(STORAGE_PREFIX + email, keys).then(() => keys);
export const generateKeys = () => Promise.resolve(nacl.sign.keyPair());
export const existing = email =>
  localforage.getItem(STORAGE_PREFIX + email).catch(e => console.warn(e));
const myKeyPair = email =>
  existing(email).then(res => res && res.secretKey && res);
export const myPublicKey = email => myKeyPair(email).then(get("publicKey"));
export const myPubKeyHex = email =>
  myPublicKey(email).then(keys => toHex(keys));
export const sign = (email, msg) =>
  myKeyPair(email).then(({ secretKey }) =>
    nacl.sign.detached(toUint8Array(msg), toUint8Array(secretKey))
  );
export const signString = (email, msg) => sign(email, util.decodeUTF8(msg));
export const signHex = (email, msg) => sign(email, msg).then(toHex);
export const signStringHex = (email, msg) => signString(email, msg).then(toHex);
export const verify = (msg, sig, pubKey) =>
  nacl.sign.detached.verify(
    toUint8Array(msg),
    toUint8Array(sig),
    toUint8Array(pubKey)
  );

export const verifyKeyPair = keys => {
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

export const getKeys = email =>
  myKeyPair(email).then(keys => (keys ? keysToHex(keys) : keys));

export const importKeys = (email, keys) =>
  Promise.resolve(keysFromHex(keys)).then(decodedKeys =>
    loadKeys(email, decodedKeys)
  );
