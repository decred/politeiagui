import { connect } from "react-redux";
import * as sel from "../selectors";
// import * as act from "../actions";

const voteStatsConnector = connect(
  sel.selectorMap({
    getVoteStatus: sel.getPropVoteStatus
  }),
  {}
);

export default voteStatsConnector;
