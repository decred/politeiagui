import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg } from "../lib/fp";

const thingLinkConnector = connect(
  sel.selectorMap({
    commentid: compose(
      t => (t ? t.toLowerCase() : t),
      get(["match", "params", "commentid"]),
      arg(1)
    ),
    isProposalStatusApproved: sel.isProposalStatusApproved,
    userId: sel.userid,
    lastBlockHeight: sel.lastBlockHeight,
    isTestnet: sel.isTestNet,
    getVoteStatus: sel.getPropVoteStatus,
    comments: sel.proposalComments,
    invoiceComments: sel.invoiceComments,
    csrf: sel.csrf,
    isCMS: sel.isCMS
  }),
  {
    confirmWithModal: act.confirmWithModal,
    onChangeProposalStatusApproved: act.onChangeProposalStatusApproved,
    getLastBlockHeight: act.getLastBlockHeight,
    onChangeDateFilter: act.onChangeDateFilter,
    onResetDateFilter: act.onResetDateFilter
  }
);

export default thingLinkConnector;
