import Promise from "promise";
import localforage from "localforage";
import nacl from "tweetnacl";
import util from "tweetnacl-util";
import get from "lodash/fp/get";

export const STORAGE_PREFIX = "ed255191~";
export const toHex = x => Buffer.from(x).toString("hex");
export const toByteArray = str => {
  const bytes = new Uint8Array(Math.ceil(str.length / 2));
  for (var i = 0; i < bytes.length; i++) bytes[i] = parseInt(str.substr(i * 2, 2), 16);
  return bytes;
};

const loadKeys = (email, keys) => localforage.setItem(STORAGE_PREFIX + email, keys).then(() => keys);
export const generateKeys = email => {
  return Promise.resolve(nacl.sign.keyPair()).then(keys => loadKeys(email, keys));
};
export const existing = email => localforage.getItem(STORAGE_PREFIX + email).catch(e => console.warn(e));
const myKeyPair = email => existing(email).then(res => (res && res.secretKey && res) || generateKeys(email));
export const myPublicKey = email => myKeyPair(email).then(get("publicKey"));
export const myPubKeyHex = email => myPublicKey(email).then(toHex);
export const sign = (email, msg) => myKeyPair(email).then(({ secretKey }) => nacl.sign.detached(msg, secretKey));
export const signString = (email, msg) => sign(email, util.decodeUTF8(msg));
export const signHex = (email, msg) => sign(email, msg).then(toHex);
export const signStringHex = (email, msg) => signString(email, msg).then(toHex);
export const verify = (msg, sig, pubKey) => nacl.sign.detached.verify(msg, sig, pubKey);

export const keysToHex = ({ publicKey, secretKey }) => ({
  publicKey: toHex(publicKey),
  secretKey: toHex(secretKey)
});

const keysFromHex = ({ publicKey, secretKey }) => ({
  publicKey: toByteArray(publicKey),
  secretKey: toByteArray(secretKey)
});

export const getKeys = email => myKeyPair(email).then(keysToHex);
export const importKeys = (email, keys) => Promise.resolve(keysFromHex(keys)).then(decodedKeys => loadKeys(email, decodedKeys));
