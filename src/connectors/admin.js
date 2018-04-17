import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";

export default connect(
  sel.selectorMap({
    proposals: sel.unvettedProposals,
    error: sel.unvettedProposalsError,
    isLoading: or(sel.unvettedProposalsIsRequesting, sel.setStatusProposalIsRequesting),
    filterValue: sel.getAdminFilterValue,
    header: () => "Unvetted Proposals"
  }),
  {
    onFetchData: act.onFetchUnvetted,
    onChangeFilter: act.onChangeFilter,
    onStartVote: act.onStartVote,
  }
);
