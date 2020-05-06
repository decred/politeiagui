import * as pki from "../pki.js";
import localforage from "localforage";
import util from "tweetnacl-util";
import nacl from "tweetnacl";

describe("Key pair generation and storage handlers (lib/pki.js)", () => {
  test("converts an object/array/string to hex representation as a string", () => {
    expect(pki.toHex([4, 34, 54])).toBe("042236");
  });

  test("converts a string to a byte array", () => {
    expect(pki.toByteArray("042236")).toEqual(new Uint8Array([4, 34, 54]));
  });

  test("converts and object to a uint8Array", () => {
    const obj = {
      0: 234,
      1: 126,
      2: 328
    };
    const uint8 = Uint8Array.from([234, 126, 328]);
    expect(pki.toUint8Array(obj)).toEqual(uint8);
    //test it doesn't change an already Uint8array object
    expect(pki.toUint8Array(uint8)).toEqual(uint8);
  });

  test("generate a key pair and save it with localforage", async () => {
    expect.assertions(1);
    const ID = "2";
    let keys = await pki.generateKeys();
    await pki.loadKeys(ID, keys);
    keys = await localforage.getItem(pki.STORAGE_PREFIX + ID);
    expect(keys).toBeTruthy();
  });

  test("returns an existing keypair saved with localforage", async () => {
    expect.assertions(2);
    const ID = "2";
    let keys = await pki.generateKeys();
    await pki.loadKeys(ID, keys);
    keys = await pki.existing(ID);
    const pubKey = await pki.myPublicKey(ID);
    expect(keys).toBeTruthy();
    expect(pubKey).toBeTruthy();
  });

  test("sign and verify a message using email and public key", async () => {
    expect.assertions(1);
    const ID = "2";
    const MSG = "hey";
    const keys = await pki.generateKeys();
    await pki.loadKeys(ID, keys);
    const pubKey = await pki.myPublicKey(ID);
    const signature = await pki.signString(ID, MSG);
    const verification = await pki.verify(
      util.decodeUTF8(MSG),
      signature,
      pubKey
    );
    expect(verification).toBe(true);
  });

  test("import keys on hex format and save it with local forage", async () => {
    expect.assertions(1);
    const keysOnHexFormat = pki.keysToHex(nacl.sign.keyPair());
    const ID = "2";
    await pki.importKeys(ID, keysOnHexFormat);
    const keysSaved = await localforage.getItem(pki.STORAGE_PREFIX + ID);
    expect(keysSaved).toBeTruthy();
  });

  test("return falsy for a not found key", async () => {
    expect.assertions(1);
    const UNEXISTENT_ID = "0";
    const keys = await pki.existing(UNEXISTENT_ID);
    expect(keys).toBeFalsy();
  });
});
