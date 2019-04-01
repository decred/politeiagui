import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { or } from "../lib/fp";
import { CMS_DEFAULT_TAB_TITLE } from "../constants";
import * as sel from "../selectors";
import * as act from "../actions";

//TODO: create filtered invoices, invoice counts, emptyInvoiceMessage and lastLoadedInvoie selectors

export default connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    invoices: sel.getVettedFilteredProposals,
    invoiceCounts: () => ({}),
    isLoading: or(
      sel.vettedProposalsIsRequesting,
      sel.isApiRequestingPropsVoteStatus
    ),
    error: or(sel.vettedProposalsError, sel.apiPropsVoteStatusError),
    filterValue: sel.getPublicFilterValue,
    header: () => CMS_DEFAULT_TAB_TITLE,
    lastLoadedInvoice: sel.lastLoadedVettedProposal,
    emptyInvoicesMessage: () => "No invoices"
  }),
  dispatch =>
    bindActionCreators(
      {
        onChangeStatus: act.onSetProposalStatus,
        onChangeFilter: act.onChangePublicFilter
      },
      dispatch
    )
);
