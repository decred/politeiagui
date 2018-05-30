import * as ecb from "../editors_content_backup";

describe("Persist editors content on session storage", () => {
  const NAME = "test title";
  const DESCRIPTION = "test description";
  const COMMENT = "test comment";
  const mockState = {
    form: {
      "form/proposal": {
        values: {
          name: NAME,
          description: DESCRIPTION
        }
      },
      "form/reply": {
        values: {
          comment: COMMENT
        }
      }
    }
  };

  const getFromSS = (key) => sessionStorage.getItem(key);
  test("save editor content from state to session storage", () => {
    ecb.handleSaveTextEditorsContent(mockState);
    expect(getFromSS("new-proposal-name")).toEqual(NAME);
    expect(getFromSS("new-proposal-description")).toEqual(DESCRIPTION);
    expect(getFromSS("new-comment::/")).toEqual(COMMENT);

    sessionStorage.clear();
    const copyMockState = JSON.parse(JSON.stringify(mockState));
    delete copyMockState.form["form/proposal"].values;
    delete copyMockState.form["form/reply"].values;
    ecb.handleSaveTextEditorsContent(copyMockState);
    expect(getFromSS("new-proposal-title")).toBeFalsy();
    expect(getFromSS("new-proposal-description")).toBeFalsy();
    expect(getFromSS("new-comment::/")).toBeFalsy();
  });

  test("clear proposals and comments content from session storage", () => {
    ecb.handleSaveTextEditorsContent(mockState);
    expect(getFromSS("new-proposal-name")).toEqual(NAME);
    expect(getFromSS("new-proposal-description")).toEqual(DESCRIPTION);
    expect(getFromSS("new-comment::/")).toEqual(COMMENT);

    ecb.resetNewProposalData();
    ecb.resetNewCommentData();
    expect(getFromSS("new-proposal-title")).toBeFalsy();
    expect(getFromSS("new-proposal-description")).toBeFalsy();
    expect(getFromSS("new-comment::/")).toBeFalsy();
  });

  test("get proposals and comments from session storage", () => {
    ecb.handleSaveTextEditorsContent(mockState);
    expect(ecb.getNewProposalData().name).toEqual(NAME);
    expect(ecb.getNewProposalData().description).toEqual(DESCRIPTION);
    expect(ecb.getNewCommentData().comment).toEqual(COMMENT);
    ecb.resetNewCommentData();
    ecb.resetNewProposalData();
    expect(ecb.getNewProposalData().name).toEqual("");
    expect(ecb.getNewProposalData().description).toEqual("");
    expect(ecb.getNewCommentData().comment).toEqual("");
  });
});
