import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

const voteStatsConnector = connect(
  sel.selectorMap({
    getVoteStatus: sel.getPropVoteStatus,
    lastBlockHeight: sel.lastBlockHeight,
    isTestnet: sel.isTestNet
  }),
  (dispatch) =>
    bindActionCreators(
      {
        onFetchVoteStatus: act.onFetchProposalVoteStatus
      },
      dispatch
    )
);

export default voteStatsConnector;
