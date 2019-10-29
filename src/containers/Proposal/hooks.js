import { useMemo } from "react";
import { useLoaderContext } from "src/containers/Loader";
import * as sel from "src/selectors";
import { useRedux } from "src/redux";
import {
  getVoteBlocksLeft,
  isVoteActiveProposal,
  getVoteTimeInWords
} from "./helpers";

export function useProposalVote(token) {
  const mapStateToProps = useMemo(() => {
    const voteSummarySelector = sel.makeGetProposalVoteSummary(token);
    return {
      voteSummary: voteSummarySelector,
      bestBlock: sel.bestBlock
    };
  }, [token]);
  const { voteSummary, bestBlock } = useRedux({}, mapStateToProps, {});
  const { apiInfo } = useLoaderContext();
  const voteTimeInWords = getVoteTimeInWords(
    voteSummary,
    bestBlock,
    apiInfo.testnet
  );
  const voteBlocksLeft = getVoteBlocksLeft(voteSummary, bestBlock);
  const voteActive = isVoteActiveProposal(voteSummary);

  return { voteSummary, voteTimeInWords, voteBlocksLeft, voteActive };
}
