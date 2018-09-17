import * as sel from "../app";
import { MOCK_STATE } from "./mock_state";
import { getTextFromIndexMd } from "../../helpers";
import { PAYWALL_STATUS_PAID, PROPOSAL_STATUS_UNREVIEWED, PROPOSAL_STATUS_CENSORED, PROPOSAL_VOTING_ACTIVE, PROPOSAL_VOTING_FINISHED, PROPOSAL_VOTING_NOT_STARTED, PROPOSAL_USER_FILTER_DRAFT, PAYWALL_STATUS_LACKING_CONFIRMATIONS } from "../../constants";
import { globalUsernamesById } from "../../actions/app";

describe("test app selector", () => {

  test("testing conditional selectors", () => {
    let state;

    // proposal
    expect(sel.proposal(MOCK_STATE)).toEqual(MOCK_STATE.api.proposal.response.proposal);

    expect(globalUsernamesById[2]).toEqual(MOCK_STATE.api.proposal.response.proposal.username);

    // getEditProposalValues
    expect(sel.getEditProposalValues(MOCK_STATE)).toEqual({
      name: MOCK_STATE.api.proposal.response.proposal.name,
      description: getTextFromIndexMd(sel.getMarkdownFile(MOCK_STATE)),
      files: sel.getNotMarkdownFile(MOCK_STATE)
    });

    state = { api: { ...MOCK_STATE.api, proposal: { response: { proposal: {} } } } };

    expect(sel.getEditProposalValues(state)).toEqual({
      name: undefined,
      description: "",
      files: []
    });

    // userCanExecuteActions && userHasPaid
    expect(sel.userHasPaid(MOCK_STATE)).toBeFalsy();

    expect(sel.userCanExecuteActions(MOCK_STATE)).toBeFalsy();

    state = { ...MOCK_STATE, app: { ...MOCK_STATE.app, userPaywallStatus: PAYWALL_STATUS_PAID } };

    expect(sel.userHasPaid(state)).toBeTruthy();

    expect(sel.userCanExecuteActions(state)).toBeTruthy();

    // getUserPaywallStatus
    expect(sel.getUserPaywallStatus(MOCK_STATE)).toEqual(PAYWALL_STATUS_LACKING_CONFIRMATIONS);

    state = { ...MOCK_STATE, api: { ...MOCK_STATE.api, me: { response: { paywalladdress: "" } } } };

    expect(sel.getUserPaywallStatus(state)).toEqual(PAYWALL_STATUS_PAID);

    // getUserPaywallConfirmation
    expect(sel.getUserPaywallConfirmations(MOCK_STATE)).toEqual(MOCK_STATE.app.userPaywallConfirmations);

    state = { ...MOCK_STATE, api: { ...MOCK_STATE.api, me: { response: { paywalladdress: "" } } } };

    expect(sel.getUserPaywallConfirmations(state)).toEqual(null);

    // proposalComments
    globalUsernamesById[2] = "username";
    expect(sel.proposalComments(MOCK_STATE)).toEqual(MOCK_STATE.api.proposalComments.response.comments);

    // unvettedProposals
    expect(sel.unvettedProposals(MOCK_STATE)).toEqual(MOCK_STATE.api.unvetted.response.proposals);

    for (const p of MOCK_STATE.api.unvetted.response.proposals) {
      expect(globalUsernamesById[p.userid]).toEqual(p.username);
    }

    // vettedProposals
    expect(sel.vettedProposals(MOCK_STATE)).toEqual(MOCK_STATE.api.vetted.response.proposals);

    for (const p of MOCK_STATE.api.vetted.response.proposals) {
      expect(globalUsernamesById[p.userid]).toEqual(p.username);
    }

    // getUnvettedFilteredProposals
    expect(sel.getUnvettedFilteredProposals(MOCK_STATE))
      .toEqual([MOCK_STATE.api.unvetted.response.proposals[1]]);

    state = { ...MOCK_STATE, app: { ...MOCK_STATE.app, adminProposalsShow: 0 } };

    expect(sel.getUnvettedFilteredProposals(state))
      .toEqual(MOCK_STATE.api.unvetted.response.proposals);



    // getVettedFilteredProposals
    expect(sel.getVettedFilteredProposals(MOCK_STATE))
      .toEqual(MOCK_STATE.api.vetted.response.proposals);

    state = { ...MOCK_STATE, app: { ...MOCK_STATE.app, publicProposalsShow: PROPOSAL_STATUS_UNREVIEWED } };

    expect(sel.getVettedFilteredProposals(state)).toEqual([]);

    // draftProposals
    expect(sel.getDraftProposals(MOCK_STATE)).toEqual([]);

    expect(sel.draftProposals(MOCK_STATE)).toEqual(MOCK_STATE.app.draftProposals);

    expect(sel.draftProposalById(MOCK_STATE)).toBeFalsy();

    // getUserProposals
    expect(sel.getUserProposals(MOCK_STATE)).toEqual(MOCK_STATE.api.userProposals.response.proposals);

    state = { ...MOCK_STATE, app: { ...MOCK_STATE.app, userProposalsShow: PROPOSAL_USER_FILTER_DRAFT } };

    expect(sel.getUserProposals(state)).toEqual([]);

    state = { ...MOCK_STATE, app: { ...MOCK_STATE.app, userProposalsShow: undefined } };

    expect(sel.getUserProposals(state)).toEqual([]);

    // __FilterCounts
    //TODO: Write test for filterCounts
    expect(sel.getUserProposalFilterCounts(MOCK_STATE)).toBeDefined();

    expect(sel.getUnvettedProposalFilterCounts(MOCK_STATE)).toBeDefined();

    expect(sel.getVettedProposalFilterCounts(MOCK_STATE)).toBeDefined();

    // __EmptyProposalsMessage
    expect(sel.getUnvettedEmptyProposalsMessage({ app: { adminProposalsShow: 12 } }))
      .toBeDefined();

    expect(sel.getUnvettedEmptyProposalsMessage({ app: { adminProposalsShow: PROPOSAL_STATUS_UNREVIEWED } }))
      .toBeDefined();

    expect(sel.getUnvettedEmptyProposalsMessage({ app: { adminProposalsShow: PROPOSAL_STATUS_CENSORED } }))
      .toBeDefined();

    expect(sel.getVettedEmptyProposalsMessage(MOCK_STATE))
      .toBeDefined();

    expect(sel.getVettedEmptyProposalsMessage({ app: { publicProposalsShow: PROPOSAL_VOTING_ACTIVE } }))
      .toBeDefined();

    expect(sel.getVettedEmptyProposalsMessage({ app: { publicProposalsShow: PROPOSAL_VOTING_FINISHED } }))
      .toBeDefined();

    expect(sel.getVettedEmptyProposalsMessage({ app: { publicProposalsShow: PROPOSAL_VOTING_NOT_STARTED } }))
      .toBeDefined();


    // ternary selectors
    expect(sel.votesEndHeight(MOCK_STATE)).toEqual({});

    state = { ...MOCK_STATE, app: { ...MOCK_STATE.app, votesEndHeight: 15 } };

    expect(sel.votesEndHeight(state)).toEqual(15);

    expect(sel.getCsrfIsNeeded(MOCK_STATE)).toBeTruthy();

    expect(sel.identityImportError(MOCK_STATE)).toEqual(MOCK_STATE.app.identityImportResult.errorMsg);

    expect(sel.identityImportSuccess(MOCK_STATE)).toEqual(MOCK_STATE.app.identityImportResult.successMsg);

    expect(sel.newProposalInitialValues(MOCK_STATE)).toEqual({});

    expect(sel.proposalCredits(MOCK_STATE)).toEqual(MOCK_STATE.app.proposalCredits);
  });

});
