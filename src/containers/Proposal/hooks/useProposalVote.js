import { useMemo } from "react";
import * as sel from "src/selectors";
import { useSelector } from "src/redux";
import {
  getVoteBlocksLeft,
  isVoteActiveProposal,
  getVoteEndTimestamp
} from "../helpers";

export default function useProposalVote(token) {
  const voteSummarySelector = useMemo(
    () => sel.makeGetProposalVoteSummary(token),
    [token]
  );
  const voteSummary = useSelector(voteSummarySelector);
  const bestBlock = useSelector(sel.bestBlock);
  const apiInfo = useSelector(sel.init);
  const voteEndTimestamp = getVoteEndTimestamp(
    voteSummary,
    bestBlock,
    apiInfo.testnet
  );
  const voteBlocksLeft = getVoteBlocksLeft(voteSummary, bestBlock);
  const voteActive = isVoteActiveProposal(voteSummary);

  return { voteSummary, voteBlocksLeft, voteActive, voteEndTimestamp };
}
