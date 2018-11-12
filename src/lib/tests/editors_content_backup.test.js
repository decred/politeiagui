import * as ecb from "../editors_content_backup";
import { setMockUrl } from "./support/helpers";

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

  const getFromSS = key => sessionStorage.getItem(key);

  test("backup new proposal content into to session storage", () => {
    const path = ecb.NEW_PROPOSAL_PATH;
    setMockUrl({ pathname: path });
    ecb.handleSaveTextEditorsContent(mockState);
    const nameKey = ecb.getProposalBackupKey(ecb.PROPOSAL_FORM_NAME, path);
    const descKey = ecb.getProposalBackupKey(ecb.PROPOSAL_FORM_DESC, path);

    // retrieve data from session storage
    expect(ecb.getNewProposalData()).toEqual({
      name: NAME,
      description: DESCRIPTION
    });
    // clear saved data
    ecb.resetNewProposalData();
    expect(getFromSS(nameKey)).toBeFalsy();
    expect(getFromSS(descKey)).toBeFalsy();

    // make sure data saved under other paths won't affect the new proposal path
    setMockUrl({ pathname: "any/path" });
    ecb.handleSaveTextEditorsContent(mockState);
    expect(getFromSS(nameKey)).toBeFalsy();
    expect(getFromSS(descKey)).toBeFalsy();
  });

  test("backup draft proposal content into session storage", () => {
    const path = ecb.NEW_PROPOSAL_PATH;
    setMockUrl({ pathname: path, search: "?draftid=draft_96x4t0pp2" });
    ecb.handleSaveTextEditorsContent(mockState);
  });
});
