import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";
import { LIST_HEADER_UNVETTED } from "../constants";

export default connect(
  sel.selectorMap({
    proposals: sel.getUnvettedFilteredProposals,
    showLookUp: () => true,
    proposalCounts: sel.getUnvettedProposalFilterCounts,
    error: sel.unvettedProposalsError,
    isLoading: or(sel.unvettedProposalsIsRequesting),
    filterValue: sel.getAdminFilterValue,
    header: () => LIST_HEADER_UNVETTED,
    emptyProposalsMessage: sel.getUnvettedEmptyProposalsMessage,
    lastLoadedProposal: sel.lastLoadedUnvettedProposal
  }),
  {
    onFetchStatus: act.onFetchUnvettedStatus,
    onFetchData: act.onFetchUnvetted,
    onChangeFilter: act.onChangeAdminFilter,
    onStartVote: act.onStartVote
  }
);
