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
    },
    app: {
      draftProposals: {
        lastSubmitted: "test",
        test: {
          name: "test",
          description: "Description",
          files: [],
          timestamp: Date.now() / 1000
        }
      }
    }
  };
  const getFromLS = (key) => localStorage.getItem(key);
  test("save state to local storage", () => {
    ls.handleSaveStateToLocalStorage(mockState);
    expect(getFromLS("state")).toBeTruthy();
  });

  test("save draft proposal to local storage", () => {
    ls.handleSaveStateToLocalStorage(mockState);
    const drafts = ls.getDraftsProposalsFromLocalStorage();
    expect(drafts).toBeTruthy();
    expect(drafts["test"]).toBeTruthy();
  });

  test("deletes draft proposal from local storage", () => {
    ls.handleSaveStateToLocalStorage(mockState);
    let drafts = ls.getDraftsProposalsFromLocalStorage();
    expect(drafts).toBeTruthy();
    expect(drafts["test"]).toBeTruthy();
    ls.deleteDraftProposalFromLocalStorage("test");
    drafts = ls.getDraftsProposalsFromLocalStorage();
    expect(drafts["test"]).toBeFalsy();
  });

  test("gets draft fields from local storage", () => {
    ls.handleSaveStateToLocalStorage(mockState);
    const draft = ls.getDraftByNameFromLocalStorage("test");
    expect(draft).toBeTruthy();
    expect(draft.name).toEqual("test");
    expect(draft.description).toEqual("Description");
    expect(draft.files.length).toEqual(0);
    expect(draft.timestamp).toBeTruthy();
  });

  test("clear state from local storage", () => {
    ls.handleSaveStateToLocalStorage(mockState);
    expect(getFromLS("state")).toBeTruthy();
    ls.clearStateLocalStorage();
    expect(getFromLS("state")).toBeFalsy();
  });
});
