import * as sel from "../../selectors";
import { reduxHook, makeHookConnector } from "../../lib/redux";

const mapStateToProps = {
  proposal: sel.proposal,
  proposalComments: sel.proposalComments,
  serverPubkey: sel.serverPubkey
};

export const useProposalDownload = reduxHook(mapStateToProps);

export const proposalDownloadConnector = makeHookConnector(useProposalDownload);
