import * as sel from "../app";
import { MOCK_STATE } from "./mock_state";
import {
  PAYWALL_STATUS_PAID,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PAYWALL_STATUS_LACKING_CONFIRMATIONS
} from "../../constants";

describe("test app selector", () => {
  it("test selectors userHasPaid and userCanExecute actions", () => {
    // userCanExecuteActions && userHasPaid
    expect(sel.userHasPaid(MOCK_STATE)).toBeFalsy();

    expect(sel.userCanExecuteActions(MOCK_STATE)).toBeFalsy();

    const state = {
      ...MOCK_STATE,
      app: { ...MOCK_STATE.app, userPaywallStatus: PAYWALL_STATUS_PAID }
    };

    expect(sel.userHasPaid(state)).toBeTruthy();

    expect(sel.userCanExecuteActions(state)).toBeTruthy();
  });

  it("test selector getUserPaywallStatus", () => {
    // getUserPaywallStatus
    expect(sel.getUserPaywallStatus(MOCK_STATE)).toEqual(
      PAYWALL_STATUS_LACKING_CONFIRMATIONS
    );

    const state = {
      ...MOCK_STATE,
      api: { ...MOCK_STATE.api, me: { response: { paywalladdress: "" } } }
    };

    expect(sel.getUserPaywallStatus(state)).toEqual(PAYWALL_STATUS_PAID);
  });

  it("test selector getUserPaywallConfirmation", () => {
    expect(sel.getUserPaywallConfirmations(MOCK_STATE)).toEqual(
      MOCK_STATE.app.userPaywallConfirmations
    );
    const state = {
      ...MOCK_STATE,
      api: { ...MOCK_STATE.api, me: { response: { paywalladdress: "" } } }
    };
    expect(sel.getUserPaywallConfirmations(state)).toEqual(null);
  });

  it("test selectors draftProposals", () => {
    expect(sel.draftProposals(MOCK_STATE)).toEqual(
      MOCK_STATE.app.draftProposals
    );
  });

  it("test selector getVettedProposalFilterCounts", () => {
    expect(sel.getVettedProposalFilterCounts(MOCK_STATE)).toBeDefined();
  });

  it("test selector getVettedEmptyProposalsMessage", () => {
    expect(sel.getVettedEmptyProposalsMessage(MOCK_STATE)).toBeDefined();

    expect(
      sel.getVettedEmptyProposalsMessage({
        app: { publicProposalsShow: PROPOSAL_VOTING_ACTIVE }
      })
    ).toBeDefined();

    expect(
      sel.getVettedEmptyProposalsMessage({
        app: { publicProposalsShow: PROPOSAL_VOTING_FINISHED }
      })
    ).toBeDefined();

    expect(
      sel.getVettedEmptyProposalsMessage({
        app: { publicProposalsShow: PROPOSAL_VOTING_NOT_AUTHORIZED }
      })
    ).toBeDefined();
  });

  it("test selector getCsrfIsNeeded", () => {
    expect(sel.getCsrfIsNeeded(MOCK_STATE)).toBeTruthy();
  });

  it("test selectors identityImportError and identityImportSuccess", () => {
    expect(sel.identityImportError(MOCK_STATE)).toEqual(
      MOCK_STATE.app.identityImportResult.errorMsg
    );

    expect(sel.identityImportSuccess(MOCK_STATE)).toEqual(
      MOCK_STATE.app.identityImportResult.successMsg
    );
  });

  it("test pollingCreditsPayment selector", () => {
    expect(sel.pollingCreditsPayment(MOCK_STATE)).toBeFalsy();
  });

  it("test selectors draftInvoices and draftInvoiceById", () => {
    expect(sel.draftInvoices(MOCK_STATE)).toEqual(MOCK_STATE.app.draftInvoices);

    expect(sel.draftInvoiceById(MOCK_STATE)).toBeFalsy();
  });
});
