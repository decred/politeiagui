import { useMemo } from "react";
import { useLoaderContext } from "src/Appv2/Loader";
import * as sel from "src/selectors";
import { useRedux } from "src/redux";
import {
  getVoteBlocksLeft,
  getVoteTimeLeftInWords,
  isVoteActiveProposal
} from "./helpers";

export function useProposalVoteInfo(proposal) {
  const { apiInfo } = useLoaderContext();
  const bestBlock =
    proposal && proposal.voteStatus && proposal.voteStatus.bestblock;
  const voteTimeLeft = getVoteTimeLeftInWords(
    proposal,
    bestBlock,
    apiInfo.testnet
  );
  const voteBlocksLeft = getVoteBlocksLeft(proposal, bestBlock);
  const voteActive = isVoteActiveProposal(proposal);

  return {
    voteActive,
    voteTimeLeft,
    voteBlocksLeft
  };
}

export function useProposalVoteStatus(token) {
  const mapStateToProps = useMemo(() => {
    const voteStatusSelector = sel.makeGetPropVoteStatus(token);
    return {
      voteStatus: voteStatusSelector
    };
  }, [token]);
  const { voteStatus } = useRedux({}, mapStateToProps, {});
  return voteStatus;
}
