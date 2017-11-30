import Promise from "promise";
import localforage from "localforage";
import nacl from "tweetnacl";
import get from "lodash/fp/get";

const STORAGE_KEY = "ed255191";
export const loadKeys = keys => localforage.setItem(STORAGE_KEY, keys).then(() => keys);
export const generateKeys = () => Promise.resolve(nacl.sign.keyPair()).then(loadKeys);
const existing = () => localforage.getItem(STORAGE_KEY).catch(e => console.warn(e || e.stack));
const myKeyPair = () => existing().then(res => (res && res.secretKey && res) || generateKeys());
export const myPublicKey = () => myKeyPair().then(get("publicKey"));
export const myPubKeyHex = () => myPublicKey().then(pubKey => Buffer.from(pubKey).toString("hex"));
export const sign = msg => myKeyPair().then(({ secretKey }) => nacl.sign.detached(msg, secretKey));
export const verify = (msg, sig, pubKey) => nacl.sign.detached.verify(msg, sig, pubKey);
