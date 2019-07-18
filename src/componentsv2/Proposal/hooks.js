import { useLoaderContext } from "src/Appv2/Loader";
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
