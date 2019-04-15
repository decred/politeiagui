import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";
import { CMS_LIST_HEADER_ADMIN } from "../constants";

//TODO: create filteredAdminInvoices, adminInvoicesCounts, emptyInvoices message selectors

export default connect(
  sel.selectorMap({
    invoices: sel.getAdminInvoices,
    showLookUp: () => true,
    invoiceCounts: sel.getAdminInvoicesCountByStatus,
    error: sel.unvettedProposalsError,
    isLoading: or(sel.isApiRequestingAdminInvoices),
    filterValue: sel.getAdminFilterValue,
    header: () => CMS_LIST_HEADER_ADMIN,
    emptyProposalsMessage: () => "No invoices",
    lastLoadedProposal: sel.lastLoadedUnvettedProposal,
    monthFilterValue: sel.getMonthFilterValue,
    yearFilterValue: sel.getYearFilterValue
  }),
  {
    onFetchData: act.onFetchAdminInvoices,
    onChangeFilter: act.onChangeAdminFilter,
    onChangeDateFilter: act.onChangeDateFilter,
    onResetDateFilter: act.onResetDateFilter
  }
);
