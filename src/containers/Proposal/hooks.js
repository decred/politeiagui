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
    const voteStatusSelector = sel.makeGetPropVoteStatus(token);
    return {
      voteStatus: voteStatusSelector
    };
  }, [token]);
  const { voteStatus } = useRedux({}, mapStateToProps, {});
  const { apiInfo } = useLoaderContext();
  // TODO: change best block ?
  const bestBlock = voteStatus && voteStatus.bestblock;
  const voteTimeLeftInWords = getVoteTimeLeftInWords(
    voteStatus,
    bestBlock,
    apiInfo.testnet
  );
  const voteBlocksLeft = getVoteBlocksLeft(voteStatus, bestBlock);
  const voteActive = isVoteActiveProposal(voteStatus);

  return { voteStatus, voteTimeLeftInWords, voteBlocksLeft, voteActive };
}
