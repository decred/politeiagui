import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";
import { LIST_HEADER_USER } from "../constants";

const userProposalsConnector = connect(
  sel.selectorMap({
    userid: sel.userid,
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    error: sel.userProposalsError,
    isLoading: or(sel.userProposalsIsRequesting),
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
        onFetchUserProposals: act.onFetchUserProposalsWithVoteStatus,
        onChangeFilter: act.onChangeUserFilter
      },
      dispatch
    )
);

const Wrapper = props => {
  const { userid, onFetchUserProposals } = props;

  useEffect(() => {
    if (userid) {
      onFetchUserProposals(userid);
    }
  }, [userid, onFetchUserProposals]);

  return (
    <div className="page content user-proposals-page">
      <props.Component {...{ ...props, userid }} />
    </div>
  );
};

const wrap = Component =>
  userProposalsConnector(props => <Wrapper {...{ ...props, Component }} />);

export default wrap;
