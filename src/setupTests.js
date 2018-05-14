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
  clear = () => {
    this.keyValue = {};
  }
}

global.localStorage = new MockedLocalStorage();

describe("setup tests", () => {
  test("should save to localStorage", () => {
    const KEY = "foo",
      VALUE = "bar";
    localStorage.setItem(KEY, VALUE);
    expect(localStorage.getItem(KEY)).toBe(VALUE);
  });
});



