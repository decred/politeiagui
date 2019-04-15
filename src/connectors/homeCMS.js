import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";

const homeCMSConnector = connect(
  sel.selectorMap({
    userid: sel.userid,
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    error: or(sel.userInvoiceError, sel.adminInvoicesError),
    isLoading: or(
      sel.isApiRequestingUserInvoices,
      sel.isApiRequestingAdminInvoices
    ),
    userInvoices: sel.apiUserInvoices,
    adminInvoices: sel.apiAdminInvoices
    //   invoiceCounts: sel.getUserInvoicesFilterCounts,
    //   filterValue: sel.getUserFilterValue,
    //   lastLoadedInvoice: sel.lastLoadedUserProposal,
    //   header: () => CMS_LIST_HEADER_USER,
    //   emptyInvoicesMessage: () => "You have not created any invoices yet",
    //   monthFilterValue: sel.getMonthFilterValue,
    //   yearFilterValue: sel.getYearFilterValue
  }),
  dispatch =>
    bindActionCreators(
      {
        onFetchUserInvoices: act.onFetchUserInvoices,
        onFetchAdminInvoices: act.onFetchAdminInvoices
      },
      dispatch
    )
);

export default homeCMSConnector;
