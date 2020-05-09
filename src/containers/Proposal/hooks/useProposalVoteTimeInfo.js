import * as sel from "src/selectors";
import { useSelector } from "src/redux";
import { getVoteBlocksLeft, getVoteEndTimestamp } from "../helpers";

export default function useProposalVoteTimeInfo(voteSummary) {
  const bestBlock = useSelector(sel.bestBlock);
  const apiInfo = useSelector(sel.init);
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
