import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";
import {
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_CENSORED,
  LIST_HEADER_UNVETTED
} from "../constants";

export default connect(
  sel.selectorMap({
    proposals: (state) => {
      let filterValue = sel.getAdminFilterValue(state);
      let proposals = sel.unvettedProposals(state);

      if(!filterValue) {
        return proposals;
      }
      return proposals.filter(proposal => proposal.status === filterValue);
    },
    error: sel.unvettedProposalsError,
    isLoading: or(sel.unvettedProposalsIsRequesting, sel.setStatusProposalIsRequesting),
    filterValue: sel.getAdminFilterValue,
    header: () => LIST_HEADER_UNVETTED,
    emptyProposalsMessage: (state) => {
      switch(sel.getAdminFilterValue(state)) {
      case PROPOSAL_STATUS_UNREVIEWED:
        return "There are no proposals to review";
      case PROPOSAL_STATUS_CENSORED:
        return "There are no censored proposals, yay!";
      default:
        return "There are no unvetted proposals";
      }
    }
  }),
  {
    onFetchData: act.onFetchUnvetted,
    onChangeFilter: act.onChangeAdminFilter,
    onStartVote: act.onStartVote,
  }
);
