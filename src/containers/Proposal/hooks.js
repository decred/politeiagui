import { useMemo } from "react";
import * as sel from "src/selectors";
import { useSelector } from "src/redux";
import {
  getVoteBlocksLeft,
  isVoteActiveProposal,
  getVoteTimeInWords
} from "./helpers";

export function useProposalVote(token) {
  const voteSummarySelector = useMemo(
    () => sel.makeGetProposalVoteSummary(token),
    [token]
  );
  const voteSummary = useSelector(voteSummarySelector);
  const bestBlock = useSelector(sel.bestBlock);
  const apiInfo = useSelector(sel.apiInitResponse);
  const voteTimeInWords = getVoteTimeInWords(
    voteSummary,
    bestBlock,
    apiInfo.testnet
  );
  const voteBlocksLeft = getVoteBlocksLeft(voteSummary, bestBlock);
  const voteActive = isVoteActiveProposal(voteSummary);

  return { voteSummary, voteTimeInWords, voteBlocksLeft, voteActive };
}
