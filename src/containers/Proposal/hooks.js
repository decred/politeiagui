import { useMemo } from "react";
import { useLoaderContext } from "src/Appv2/Loader";
import * as sel from "src/selectors";
import { useRedux } from "src/redux";
import {
  getVoteBlocksLeft,
  isVoteActiveProposal,
  getVoteTimeLeftInWords
} from "./helpers";

export function useProposalVote(token) {
  const mapStateToProps = useMemo(() => {
    const voteSummarySelector = sel.makeGetPropVoteSummary(token);
    return {
      voteSummary: voteSummarySelector,
      bestBlock: sel.getBestBlockFromVoteSummaryResponse
    };
  }, [token]);
  const { voteSummary, bestBlock } = useRedux({}, mapStateToProps, {});
  const { apiInfo } = useLoaderContext();
  const voteTimeLeftInWords = getVoteTimeLeftInWords(
    voteSummary,
    bestBlock,
    apiInfo.testnet
  );
  const voteBlocksLeft = getVoteBlocksLeft(voteSummary, bestBlock);
  const voteActive = isVoteActiveProposal(voteSummary);

  return { voteSummary, voteTimeLeftInWords, voteBlocksLeft, voteActive };
}
