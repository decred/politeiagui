import * as pki from "./pki.js";
import localforage from "localforage";
import dummyStorageDriver from "./tests/dummyStorageDriver";


describe("Key pair handlers", () => {

  beforeEach(() => {
    //define the dummy driver before each testing execution
    localforage.defineDriver(dummyStorageDriver, function() {
      localforage.setDriver(dummyStorageDriver._driver, function() {
        //ok
      });
    });
  });

  test("converts an object/array/string to hex representation as a string", () => {
    expect(pki.toHex([4, 34, 54])).toBe("042236");
  });

  test("converts a string to a byte array", () => {
    expect(pki.toByteArray("042236")).toEqual(new Uint8Array([4, 34, 54]));
  });

  test("generate a key pair and save it to localforage", async () => {
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

  // test("sign and verify a message", async () => {
  //   // expect.assertions(1);
  //   const EMAIL = "foo@bar.com";
  //   const MSG = await pki.toByteArray("042236");
  //   await pki.generateKeys(EMAIL);
  //   const pubKey = await pki.myPublicKey(EMAIL);
  //   const transformedPubKey = transformDummyStorageFormatToUnint8(pubKey);
  //   const signature = await pki.sign(EMAIL, "hey");
  //   console.log(signature);
  //   console.log(MSG);
  //   console.log(transformedPubKey);
  //   // const verification = await pki.verify(MSG, signature, transformedPubKey);
  //   // console.log(verification);
  //   // expect(verification).toBeTruthy();
  // })
});
