import * as sel from "../app";
import { MOCK_STATE } from "./mock_state";

describe("test app selector", () => {
  it("test selectors draftProposals", () => {
    expect(sel.draftProposals(MOCK_STATE)).toEqual(
      MOCK_STATE.app.draftProposals
    );
  });

  it("test selector identityImportSuccess", () => {
    expect(sel.identityImportSuccess(MOCK_STATE)).toEqual(
      MOCK_STATE.app.identityImportResult.successMsg
    );
  });

  it("test pollingCreditsPayment selector", () => {
    expect(sel.pollingCreditsPayment(MOCK_STATE)).toBeFalsy();
  });

  it("test selectors draftInvoices", () => {
    expect(sel.draftInvoices(MOCK_STATE)).toEqual(MOCK_STATE.app.draftInvoices);
  });
});
