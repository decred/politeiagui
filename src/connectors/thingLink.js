import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const thingLinkConnector = connect(
  sel.selectorMap({
    isProposalStatusApproved: sel.isProposalStatusApproved,
    tokenFromStartingVoteProp: sel.getPropTokenIfIsStartingVote,
    userId: sel.userid,
    lastBlockHeight: sel.lastBlockHeight,
    isTestnet: sel.isTestNet,
    getVoteStatus: sel.getPropVoteStatus,
    comments: sel.proposalComments,
    csrf: sel.csrf
  }),
  {
    confirmWithModal: act.confirmWithModal,
    onChangeProposalStatusApproved: act.onChangeProposalStatusApproved,
    getLastBlockHeight: act.getLastBlockHeight
  }
);

export default thingLinkConnector;
