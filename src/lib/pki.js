import Promise from "promise";
import localforage from "localforage";
import nacl from "tweetnacl";
import util from "tweetnacl-util";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";

const STORAGE_KEY = "ed255191";
const toHex = x => Buffer.from(x).toString("hex");
const toByteArray = str => {
  const bytes = new Uint8Array(Math.ceil(str.length / 2));
  for (var i = 0; i < bytes.length; i++) bytes[i] = parseInt(str.substr(i * 2, 2), 16);
  return bytes;
};

const loadKeys = keys => localforage.setItem(STORAGE_KEY, keys).then(() => keys);
export const generateKeys = () => Promise.resolve(nacl.sign.keyPair()).then(loadKeys);
export const existing = () => localforage.getItem(STORAGE_KEY).catch(e => console.warn(e || e.stack));
const myKeyPair = () => existing().then(res => (res && res.secretKey && res) || generateKeys());
export const myPublicKey = () => myKeyPair().then(get("publicKey"));
export const myPubKeyHex = () => myPublicKey().then(toHex);
export const sign = msg => myKeyPair().then(({ secretKey }) => nacl.sign.detached(msg, secretKey));
export const signString = msg => sign(util.decodeUTF8(msg));
export const signHex = msg => sign(msg).then(toHex);
export const signStringHex = msg => signString(msg).then(toHex);
export const verify = (msg, sig, pubKey) => nacl.sign.detached.verify(msg, sig, pubKey);

const keysToHex = ({ publicKey, secretKey }) => ({
  publicKey: toHex(publicKey), secretKey: toHex(secretKey)
});

const keysFromHex = ({ publicKey, secretKey }) => ({
  publicKey: toByteArray(publicKey), secretKey: toByteArray(secretKey)
});

export const getKeys = () => myKeyPair().then(keysToHex);
export const importKeys = compose(loadKeys, keysFromHex);
