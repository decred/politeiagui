import * as sel from "src/selectors";
import { useSelector } from "src/redux";
import { getVoteBlocksLeft, getVoteEndTimestamp } from "../helpers";

export default function useProposalVoteTimeInfo(voteSummary) {
  const apiInfo = useSelector(sel.init);
  const bestBlock = voteSummary ? voteSummary.bestblock : 0;
  const voteEndTimestamp = getVoteEndTimestamp(
    voteSummary,
    bestBlock,
    apiInfo.testnet
  );
  const voteBlocksLeft = getVoteBlocksLeft(voteSummary, bestBlock);

  return {
    voteBlocksLeft,
    voteEndTimestamp
  };
}
