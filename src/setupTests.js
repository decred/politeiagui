import localforage from "localforage";
import dummyStorageDriver from "./lib/tests/dummyStorageDriver";

class MockedLocalStorage {
  constructor() {
    this.keyValue = {};
  }
  setItem = (key, value) => {
    this.keyValue = {
      ...this.keyValue,
      [key]: value
    };
  }
  getItem = (key) => this.keyValue[key]
  removeItem = (key) => {
    delete this.keyValue[key];
  }
  clear = () => {
    this.keyValue = {};
  }
}

class MockedSessionStorage extends MockedLocalStorage {
  constructor() {
    super();
  }
}

global.sessionStorage = new MockedSessionStorage();
global.localStorage = new MockedLocalStorage();

beforeEach(() => {
  //define the dummy driver before each testing execution
  localforage.defineDriver(dummyStorageDriver, function() {
    localforage.setDriver(dummyStorageDriver._driver, function() {
      //ok
      localforage.clear();
    });
  });
});

describe("setup tests", () => {
  test("mock local storage works", () => {
    const KEY = "foo",
      VALUE = "bar";
    localStorage.setItem(KEY, VALUE);
    expect(localStorage.getItem(KEY)).toBe(VALUE);
    localStorage.removeItem(KEY);
    expect(localStorage.getItem(KEY)).toBeFalsy();
  });
});



