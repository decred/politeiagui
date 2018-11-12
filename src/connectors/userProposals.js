import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";
import {
  LIST_HEADER_USER,
  PROPOSAL_USER_FILTER_SUBMITTED,
  PROPOSAL_USER_FILTER_DRAFT
} from "../constants";

const userProposalsConnector = connect(
  sel.selectorMap({
    userid: sel.userid,
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    error: sel.userProposalsError,
    isLoading: or(
      sel.userProposalsIsRequesting,
      sel.isApiRequestingPropsVoteStatus
    ),
    proposals: sel.getUserProposals,
    proposalCounts: sel.getUserProposalFilterCounts,
    filterValue: sel.getUserFilterValue,
    lastLoadedProposal: sel.lastLoadedUserProposal,
    header: () => LIST_HEADER_USER,
    emptyProposalsMessage: () => "You have not created any proposals yet"
  }),
  dispatch =>
    bindActionCreators(
      {
        onFetchUserProposals: act.onFetchUserProposals,
        onChangeFilter: act.onChangeUserFilter,
        onFetchProposalsVoteStatus: act.onFetchProposalsVoteStatus
      },
      dispatch
    )
);

class Wrapper extends Component {
  componentDidMount() {
    const { match, onChangeFilter, userid } = this.props;

    if (match.params && typeof match.params.filter !== "undefined") {
      onChangeFilter(
        {
          submitted: PROPOSAL_USER_FILTER_SUBMITTED,
          drafts: PROPOSAL_USER_FILTER_DRAFT
        }[match.params.filter]
      );
    }

    if (userid) {
      this.props.onFetchUserProposals(userid);
    }
  }

  componentDidUpdate(prevProps) {
    const { userid } = this.props;
    const userFetched = !prevProps.userid && this.props.userid;
    if (userFetched) this.props.onFetchUserProposals(userid);
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
  userProposalsConnector(props => <Wrapper {...{ ...props, Component }} />);

export default wrap;
