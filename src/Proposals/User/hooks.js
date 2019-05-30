import { useEffect } from "react";
import { or } from "../../lib/fp";
import * as sel from "../../selectors";
import * as act from "../../actions";
import { useRedux, makeHookConnector } from "../../lib/redux";
import { LIST_HEADER_USER } from "../../constants";

const mapStateToProps = {
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
};

const mapDispatchToProps = {
  onFetchUserProposals: act.onFetchUserProposalsWithVoteStatus,
  onChangeFilter: act.onChangeUserFilter
};

export const useUserProposals = props => {
  const extraProps = useRedux(props, mapStateToProps, mapDispatchToProps);
  const { userid } = extraProps;

  useEffect(() => {
    if (userid) extraProps.onFetchUserProposals(userid);
  }, [userid]);

  return extraProps;
};

export const userProposalsConnector = makeHookConnector(useUserProposals);
