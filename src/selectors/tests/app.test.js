import * as sel from "../app";
import { MOCK_STATE } from "./mock_state";
import { getTextFromIndexMd } from "../../helpers";
import {
  PAYWALL_STATUS_PAID,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_USER_FILTER_DRAFT,
  PAYWALL_STATUS_LACKING_CONFIRMATIONS
} from "../../constants";

describe("test app selector", () => {
  it("test selector proposal", () => {
    expect(sel.proposal(MOCK_STATE)).toEqual(
      MOCK_STATE.api.proposal.response.proposal
    );
  });

  it("test selector getEditProposalsValues", () => {
    expect(sel.getEditProposalValues(MOCK_STATE)).toEqual({
      name: MOCK_STATE.api.proposal.response.proposal.name,
      description: getTextFromIndexMd(sel.getMarkdownFile(MOCK_STATE)),
      files: sel.getNotMarkdownFile(MOCK_STATE)
    });

    const state = {
      api: { ...MOCK_STATE.api, proposal: { response: { proposal: {} } } }
    };

    expect(sel.getEditProposalValues(state)).toEqual({
      name: undefined,
      description: "",
      files: []
    });
  });

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

  it("test selector proposalComments", () => {
    expect(sel.proposalComments(MOCK_STATE)).toEqual(
      MOCK_STATE.api.proposalComments.response.comments
    );
  });

  it("test selector unvettedProposals", () => {
    expect(sel.unvettedProposals(MOCK_STATE)).toEqual(
      MOCK_STATE.api.unvetted.response.proposals
    );
  });

  it("test selector vettedProposals", () => {
    // vettedProposals
    expect(sel.vettedProposals(MOCK_STATE)).toEqual(
      MOCK_STATE.api.vetted.response.proposals
    );
  });

  it("test selector getUnvettedFilteredProposals", () => {
    expect(sel.getUnvettedFilteredProposals(MOCK_STATE)).toEqual([
      MOCK_STATE.api.unvetted.response.proposals[2],
      MOCK_STATE.api.unvetted.response.proposals[0]
    ]);

    const state = {
      ...MOCK_STATE,
      app: { ...MOCK_STATE.app, adminProposalsShow: 0 }
    };

    expect(sel.getUnvettedFilteredProposals(state)).toEqual(
      MOCK_STATE.api.unvetted.response.proposals
    );
  });

  it("test selector getVettedFilteredProposals", () => {
    expect(sel.getVettedFilteredProposals(MOCK_STATE)).toEqual(
      MOCK_STATE.api.vetted.response.proposals
    );
    const state = {
      ...MOCK_STATE,
      app: {
        ...MOCK_STATE.app,
        publicProposalsShow: PROPOSAL_STATUS_UNREVIEWED
      }
    };
    expect(sel.getVettedFilteredProposals(state)).toEqual([]);
  });

  it("test selector getDraftProposals", () => {
    expect(sel.getDraftProposals(MOCK_STATE)).toEqual([]);
  });

  it("test selectors draftProposals and draftProposalsById", () => {
    expect(sel.draftProposals(MOCK_STATE)).toEqual(
      MOCK_STATE.app.draftProposals
    );

    expect(sel.draftProposalById(MOCK_STATE)).toBeFalsy();
  });

  it("test selector getUserProposalFilterCounts", () => {
    //TODO: Write test for filterCounts
    expect(sel.getUserProposalFilterCounts(MOCK_STATE)).toBeDefined();
  });

  it("test selector getUnvettedProposalFilterCounts", () => {
    expect(sel.getUnvettedProposalFilterCounts(MOCK_STATE)).toBeDefined();
  });

  it("test selector getVettedProposalFilterCounts", () => {
    expect(sel.getVettedProposalFilterCounts(MOCK_STATE)).toBeDefined();
  });

  it("test selector getUnvettedEmptyProposalsMessage", () => {
    expect(
      sel.getUnvettedEmptyProposalsMessage({ app: { adminProposalsShow: 12 } })
    ).toBeDefined();

    expect(
      sel.getUnvettedEmptyProposalsMessage({
        app: { adminProposalsShow: PROPOSAL_STATUS_UNREVIEWED }
      })
    ).toBeDefined();

    expect(
      sel.getUnvettedEmptyProposalsMessage({
        app: { adminProposalsShow: PROPOSAL_STATUS_CENSORED }
      })
    ).toBeDefined();
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

  it("test selector votesEndHeight", () => {
    expect(sel.votesEndHeight(MOCK_STATE)).toEqual({});
    const state = {
      ...MOCK_STATE,
      app: { ...MOCK_STATE.app, votesEndHeight: 15 }
    };
    expect(sel.votesEndHeight(state)).toEqual(15);
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

  it("test selector newProposalInitialValues", () => {
    expect(sel.newProposalInitialValues(MOCK_STATE)).toEqual({});
  });

  it("test selector proposalCredits", () => {
    expect(sel.proposalCredits(MOCK_STATE)).toEqual(
      MOCK_STATE.app.proposalCredits
    );
  });

  it("test getUserProposals selector", () => {
    // getUserProposals
    expect(sel.getUserProposals(MOCK_STATE)).toEqual(
      MOCK_STATE.api.userProposals.response.proposals
    );

    let state = {
      ...MOCK_STATE,
      app: { ...MOCK_STATE.app, userProposalsShow: PROPOSAL_USER_FILTER_DRAFT }
    };

    expect(sel.getUserProposals(state)).toEqual([]);

    state = {
      ...MOCK_STATE,
      app: { ...MOCK_STATE.app, userProposalsShow: undefined }
    };

    expect(sel.getUserProposals(state)).toEqual([]);
  });

  it("test pollingCreditsPayment selector", () => {
    expect(sel.pollingCreditsPayment(MOCK_STATE)).toBeFalsy();
  });
});
