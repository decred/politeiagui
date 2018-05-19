import * as ls from "../local_storage";
describe("save state chunks to local storage (lib/local_storage.js", () => {
  const mockState = {
    api: {
      me: {
        response: {
          email: "foo@bar.com",
          username: "foobar"
        }
      },
      changeUsername: {
        response: {
          username: "foobar"
        }
      }
    }
  };
  const getFromLS = (key) => localStorage.getItem(key);
  test("save state to local storage", () => {
    ls.handleSaveStateToLocalStorage(mockState);
    expect(getFromLS("state")).toBeTruthy();
  });

  test("clear state from local storage", () => {
    ls.handleSaveStateToLocalStorage(mockState);
    expect(getFromLS("state")).toBeTruthy();
    ls.clearStateLocalStorage();
    expect(getFromLS("state")).toBeFalsy();
  });
});
