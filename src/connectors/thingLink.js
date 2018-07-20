import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const proposalDownloadConnector = connect(
  sel.selectorMap({
    isProposalStatusApproved: sel.isProposalStatusApproved,
    tokenFromStartingVoteProp: sel.getPropTokenIfIsStartingVote,
    lastBlockHeight: sel.lastBlockHeight,
    isTestnet: sel.isTestNet,
    getVoteStatus: sel.getPropVoteStatus,
    csrf: sel.csrf,
  }),
  {
    openModal: act.openModal,
    onChangeProposalStatusApproved: act.onChangeProposalStatusApproved,
  }
);

export default proposalDownloadConnector;
