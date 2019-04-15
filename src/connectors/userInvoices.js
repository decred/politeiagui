import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";
import { CMS_LIST_HEADER_USER } from "../constants";

const userInvoicesConnector = connect(
  sel.selectorMap({
    userid: sel.userid,
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    error: sel.userProposalsError,
    isLoading: or(sel.isApiRequestingUserInvoices),
    invoices: sel.getUserInvoices,
    invoiceCounts: sel.getUserInvoicesFilterCounts,
    filterValue: sel.getUserFilterValue,
    lastLoadedInvoice: sel.lastLoadedUserProposal,
    header: () => CMS_LIST_HEADER_USER,
    emptyInvoicesMessage: () => "You have not created any invoices yet",
    monthFilterValue: sel.getMonthFilterValue,
    yearFilterValue: sel.getYearFilterValue
  }),
  dispatch =>
    bindActionCreators(
      {
        onFetchUserInvoices: act.onFetchUserInvoices,
        onChangeFilter: act.onChangeUserFilter,
        onChangeDateFilter: act.onChangeDateFilter,
        onResetDateFilter: act.onResetDateFilter
      },
      dispatch
    )
);

class Wrapper extends Component {
  componentDidMount() {
    const { userid } = this.props;

    if (userid) {
      this.props.onFetchUserInvoices(userid);
    }
  }

  componentDidUpdate(prevProps) {
    const { userid } = this.props;
    const userFetched = !prevProps.userid && this.props.userid;
    if (userFetched) this.props.onFetchUserInvoices(userid);
  }

  render() {
    const { Component, ...props } = this.props;
    return (
      <div className="page content user-proposals-page">
        <Component {...{ ...props }} />
      </div>
    );
  }
}

const wrap = Component =>
  userInvoicesConnector(props => <Wrapper {...{ ...props, Component }} />);

export default wrap;
