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

  test("generate a key pair and save it with localforage", async () => {
    expect.assertions(1);
    const EMAIL = "foo@bar.com";
    await pki.generateKeys(EMAIL);
    const keys = await localforage.getItem(pki.STORAGE_PREFIX + EMAIL);
    expect(keys).toBeTruthy();
  });

  test("returns a existing keypair saved with locaforage", async () => {
    expect.assertions(2);
    const EMAIL = "foo@bar.com";
    await pki.generateKeys(EMAIL);
    const keys = await pki.existing(EMAIL);
    const pubKey = await pki.myPublicKey(EMAIL);
    expect(keys).toBeTruthy();
    expect(pubKey).toBeTruthy();
  });

  test("sign and verify a message using email and public key", async () => {
    expect.assertions(1);
    const EMAIL = "foo@bar.com";
    const MSG = "hey";
    await pki.generateKeys(EMAIL);
    const pubKey = await pki.myPublicKey(EMAIL);
    const signature = await pki.signString(EMAIL, MSG);
    const verification = await pki.verify(util.decodeUTF8(MSG), signature, pubKey);
    expect(verification).toBe(true);
  });

  test("import keys on hex format and save it with local forage", async () => {
    expect.assertions(1);
    const keysOnHexFormat = pki.keysToHex(nacl.sign.keyPair());
    const EMAIL = "foo@bar.com";
    await pki.importKeys(EMAIL, keysOnHexFormat);
    const keysSaved = await localforage.getItem(pki.STORAGE_PREFIX + EMAIL);
    expect(keysSaved).toBeTruthy();
  });

  test("return falsy for a not found key",  async () => {
    expect.assertions(1);
    const UNEXISTENT_EMAIL = "a@a.com";
    const keys = await pki.existing(UNEXISTENT_EMAIL);
    expect(keys).toBeFalsy();
  });
});
