import { connect } from "react-redux";
import * as sel from "../selectors";

const voteStatsConnector = connect(
  sel.selectorMap({
    getVoteStatus: sel.getPropVoteStatus,
    lastBlockHeight: sel.lastBlockHeight
  })
);

export default voteStatsConnector;
