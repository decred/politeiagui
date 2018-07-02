import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { or } from "../lib/fp";
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
    emptyProposalsMessage: () => "There are no active proposals"
  }),
  dispatch => bindActionCreators({
    onFetchData: act.onFetchVetted,
    onChangeStatus: act.onSubmitStatusProposal,
    onFetchProposalsVoteStatus: act.onFetchProposalsVoteStatus,
    onChangeFilter: act.onChangePublicFilter
  }, dispatch)
);
