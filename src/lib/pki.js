import Promise from "promise";
import localforage from "localforage";
import nacl from "tweetnacl";
import get from "lodash/fp/get";

const LOCALFORAGE_KEY = "ed255191";

export const loadKeys = ({ publicKey, secretKey }) => localforage
  .setItem(LOCALFORAGE_KEY, { publicKey, secretKey })
  .then(() => ({ publicKey, secretKey }));

const generateKeys = () => Promise
  .resolve(nacl.sign.keyPair())
  .then(loadKeys);

const existingKeys = () => localforage.getItem(LOCALFORAGE_KEY)
  .catch(err => console.warn(err || err.stack));

const myKeyPair = () => existingKeys().then(res => (res && res.secretKey && res) || generateKeys());

export const reset = generateKeys();
export const myPublicKey = () => myKeyPair().then(get("publicKey"));
export const sign = msg => myKeyPair().then(({ secretKey }) => nacl.sign.detached(msg, secretKey));
export const verify = (msg, sig, pubKey) => nacl.sign.detached.verify(msg, sig, pubKey);
