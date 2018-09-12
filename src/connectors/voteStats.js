import { connect } from "react-redux";
import * as sel from "../selectors";
<<<<<<< HEAD
=======
import * as act from "../actions";
>>>>>>> added lastBlockHeight and endHeight prop on component to show how many blocks are left

const voteStatsConnector = connect(
  sel.selectorMap({
    getVoteStatus: sel.getPropVoteStatus,
    lastBlockHeight: sel.lastBlockHeight
<<<<<<< HEAD
  })
=======
  }),
  {
    getLastBlockHeight: act.getLastBlockHeight
  }
>>>>>>> added lastBlockHeight and endHeight prop on component to show how many blocks are left
);

export default voteStatsConnector;
