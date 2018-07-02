import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { or } from "../lib/fp";
import {
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_VOTING_NOT_STARTED
} from "../constants";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    proposals: (state) => {
      const vettedProps = sel.vettedProposals(state);
      const filterValue = sel.getPublicFilterValue(state);
      if (!filterValue)
        return vettedProps;
      return vettedProps.filter(prop => {
        return filterValue === sel.getPropVoteStatus(state)(prop.censorshiprecord.token).status;
      });
    },
    isLoading: or(sel.vettedProposalsIsRequesting, sel.isApiRequestingPropsVoteStatus),
    error: or(sel.vettedProposalsError, sel.apiPropsVoteStatusError),
    filterValue: sel.getPublicFilterValue,
    header: () => "Active Proposals",
    emptyProposalsMessage: (state) => {
      switch(sel.getPublicFilterValue(state)) {
      case PROPOSAL_VOTING_ACTIVE:
        return "There are no voting open proposals";
      case PROPOSAL_VOTING_FINISHED:
        return "There are no voting finished proposals";
      case PROPOSAL_VOTING_NOT_STARTED:
        return "There are no pre-voting proposals";
      default:
        return "There are no proposals";
      }
    }
  }),
  dispatch => bindActionCreators({
    onFetchData: act.onFetchVetted,
    onChangeStatus: act.onSubmitStatusProposal,
    onFetchProposalsVoteStatus: act.onFetchProposalsVoteStatus,
    onChangeFilter: act.onChangePublicFilter
  }, dispatch)
);
