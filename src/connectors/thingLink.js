import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const proposalDownloadConnector = connect(
  sel.selectorMap({
    isProposalStatusApproved: sel.isProposalStatusApproved,
    tokenFromStartingVoteProp: sel.getPropTokenIfIsStartingVote,
    lastBlockHeight: sel.lastBlockHeight,
    activeVotesEndHeight: sel.activeVotesEndHeight,
    isTestnet: sel.isTestNet
  }),
  {
    onChangeProposalStatusApproved: act.onChangeProposalStatusApproved,
    setActiveVotesEndHeight: act.setActiveVotesEndHeight,
    getLastBlockHeight: act.getLastBlockHeight,
  }
);

export default proposalDownloadConnector;
