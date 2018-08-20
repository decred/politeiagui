import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { LIST_HEADER_USER, PROPOSAL_USER_FILTER_SUBMITTED, PROPOSAL_USER_FILTER_DRAFT } from "../constants";

const userProposalsConnector = connect(
  sel.selectorMap({
    userid: sel.userid,
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    error: sel.userProposalsError,
    isLoading: sel.userProposalsIsRequesting,
    proposals: sel.getUserProposals,
    proposalCounts: sel.getUserProposalFilterCounts,
    filterValue: sel.getUserFilterValue,
    header: () => LIST_HEADER_USER,
    emptyProposalsMessage: () => "You have not created any proposals yet"
  }),
  dispatch =>
    bindActionCreators(
      {
        onFetchUserProposals: act.onFetchUserProposals,
        onChangeFilter: act.onChangeUserFilter
      },
      dispatch
    )
);

class Wrapper extends Component {

  componentDidMount() {
    const {
      userid,
      loggedInAsEmail,
      history,
      match,
      onFetchUserProposals,
      onChangeFilter
    } = this.props;

    if (!loggedInAsEmail) history.push("/login");
    if (userid !== null) onFetchUserProposals(userid);
    if (match.params && typeof match.params.filter !== "undefined") {
      onChangeFilter({
        "submitted": PROPOSAL_USER_FILTER_SUBMITTED,
        "drafts": PROPOSAL_USER_FILTER_DRAFT
      }[match.params.filter]);
    }
  }

  render () {
    const { Component, ...props } = this.props;
    return (
      <div className="page content user-proposals-page">
        <Component {...{ ...props }} />
      </div>
    );
  }

}

const wrap = Component =>
  userProposalsConnector(props => <Wrapper {...{ ...props, Component }} />);

export default wrap;
