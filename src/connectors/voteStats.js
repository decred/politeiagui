import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const voteStatsConnector = connect(
  sel.selectorMap({
    getVoteStatus: sel.getPropVoteStatus,
    lastBlockHeight: sel.lastBlockHeight
  }),
  {
    getLastBlockHeight: act.getLastBlockHeight
  }
);

export default voteStatsConnector;
