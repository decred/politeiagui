import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";
import { CMS_LIST_HEADER_ADMIN } from "../constants";

//TODO: create filteredAdminInvoices, adminInvoicesCounts, emptyInvoices message selectors

export default connect(
  sel.selectorMap({
    invoices: sel.getUnvettedFilteredProposals,
    showLookUp: () => true,
    invoiceCounts: () => ({}),
    error: sel.unvettedProposalsError,
    isLoading: or(sel.unvettedProposalsIsRequesting),
    filterValue: sel.getAdminFilterValue,
    header: () => CMS_LIST_HEADER_ADMIN,
    emptyProposalsMessage: () => "No invoices",
    lastLoadedProposal: sel.lastLoadedUnvettedProposal
  }),
  {
    onFetchStatus: act.onFetchUnvettedStatus,
    onFetchData: act.onFetchUnvetted,
    onChangeFilter: act.onChangeAdminFilter
  }
);
