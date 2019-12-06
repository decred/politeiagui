import localforage from "localforage";
import dummyStorageDriver from "./lib/tests/support/dummyStorageDriver";
import { registerAssertions } from "redux-actions-assertions/jest";
import { registerMiddlewares } from "redux-actions-assertions";
import thunk from "redux-thunk";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

// setup enzyme adapter
configure({ adapter: new Adapter() });

class MockedLocalStorage {
  constructor() {
    this.keyValue = {};
  }
  inspectValues = () => this.keyValue;
  setItem = (key, value) => {
    this.keyValue = {
      ...this.keyValue,
      [key]: value
    };
  };
  getItem = (key) => this.keyValue[key];
  removeItem = (key) => {
    delete this.keyValue[key];
  };
  clear = () => {
    this.keyValue = {};
  };
}

class MockedSessionStorage extends MockedLocalStorage {
  constructor() {
    super();
  }
}

global.sessionStorage = new MockedSessionStorage();
global.localStorage = new MockedLocalStorage();

beforeAll(() => {
  //define the dummy driver before each testing execution
  localforage.defineDriver(dummyStorageDriver, function() {
    localforage.setDriver(dummyStorageDriver._driver, function() {
      //ok
      localforage.clear();
    });
  });
  registerMiddlewares([thunk]);
});

beforeEach(registerAssertions);

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

describe("test redux actions assertions", () => {
  test("test actinos dispatched", () => {
    const testAction = () => ({
      type: "TEST_ACTION"
    });
    const someAction = () => (dispatch) => {
      dispatch(testAction());
    };
    expect(someAction()).toDispatchActions({ type: "TEST_ACTION" }, true);
  });
});

const appRoot = document.createElement("div");
appRoot.setAttribute("id", "root");
document.body.append(appRoot);
