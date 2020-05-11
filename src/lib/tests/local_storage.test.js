import * as ls from "../local_storage";
describe("save state chunks to local storage (lib/local_storage.js", () => {
  const mockState = {
    api: {
      me: {
        response: {
          email: "foo@bar.com",
          username: "foobar",
          userid: "testid"
        }
      },
      changeUsername: {
        response: {
          username: "foobar"
        }
      }
    },
    app: {
      draftProposals: {
        draft_id: {
          draftid: "draft_id",
          name: "test",
          description: "Description",
          files: [],
          timestamp: Date.now() / 1000
        }
      },
      draftInvoices: {
        draft_id: {
          month: "month",
          year: "year",
          name: "name",
          location: "location",
          contact: "contact",
          rate: "20",
          address: "",
          lineitems: [],
          files: [],
          draftId: "draft_id",
          timestamp: Date.now() / 1000
        }
      }
    },
    users: {
      byID: {
        testid: {
          email: "foo@bar.com",
          username: "foobar"
        }
      },
      currentUserID: "testid"
    }
  };
  const getFromLS = (key) => localStorage.getItem(key);
  test("save state to local storage without passing uuid as parameter", () => {
    ls.handleSaveStateToLocalStorage(mockState);
    expect(getFromLS(ls.stateKey(mockState.users.currentUserID))).toBeTruthy();
  });

  test("save draft proposal to local storage", () => {
    const { userid } = mockState.api.me.response;
    const lsKey = ls.stateKey(userid);

    ls.handleSaveStateToLocalStorage(mockState);
    expect(getFromLS(lsKey)).toBeTruthy();
    expect(ls.loadStateLocalStorage(userid)).toEqual({
      app: mockState.app
    });

    localStorage.setItem(lsKey, "");
    // test that without passing the email nothing will be saved
    const copyState = JSON.parse(JSON.stringify(mockState));
    delete copyState.api.me.response;
    delete copyState.users;
    ls.handleSaveStateToLocalStorage(copyState);
    expect(getFromLS(lsKey)).toBeFalsy();
  });

  test("save draft invoice to local storage", () => {
    const { userid } = mockState.api.me.response;
    const lsKey = ls.stateKey(userid);

    ls.handleSaveStateToLocalStorage(mockState);
    expect(getFromLS(lsKey)).toBeTruthy();
    expect(ls.loadStateLocalStorage(userid)).toEqual({
      app: mockState.app
    });

    localStorage.setItem(lsKey, "");
    // test that without passing the uuid nothing will be saved
    const copyState = JSON.parse(JSON.stringify(mockState));
    delete copyState.api.me.response;
    delete copyState.users;
    ls.handleSaveStateToLocalStorage(copyState);
    expect(getFromLS(lsKey)).toBeFalsy();
  });

  test("clear state from local storage", () => {
    const { userid } = mockState.api.me.response;
    const lsKey1 = ls.loggedInStateKey;
    const lsKey2 = ls.stateKey(userid);
    ls.handleSaveStateToLocalStorage(mockState);
    expect(getFromLS(lsKey1)).toBeFalsy();
    ls.clearStateLocalStorage();
    expect(getFromLS(lsKey1)).toBeFalsy();

    expect(getFromLS(lsKey2)).toBeTruthy();
    ls.clearStateLocalStorage(userid);
    expect(getFromLS(lsKey2)).toBeFalsy();
  });
});
