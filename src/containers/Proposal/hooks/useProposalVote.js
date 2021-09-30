import { useMemo } from "react";
import * as sel from "src/selectors";
import { useSelector } from "src/redux";
import { isVoteActiveProposal } from "../helpers";
import useProposalVoteTimeInfo from "./useProposalVoteTimeInfo";

export default function useProposalVote(token) {
  const voteSummarySelector = useMemo(
    () => sel.makeGetProposalVoteSummary(token),
    [token]
  );
  const proposalSummarySelector = useMemo(
    () => sel.makeGetProposalSummaryByToken(token),
    [token]
  );
  const voteSummary = useSelector(voteSummarySelector);
  const proposalSummary = useSelector(proposalSummarySelector);
  const voteActive = isVoteActiveProposal(voteSummary);
  const { voteEndTimestamp, voteBlocksLeft } =
    useProposalVoteTimeInfo(voteSummary);
  return {
    voteSummary,
    proposalSummary,
    voteBlocksLeft,
    voteActive,
    voteEndTimestamp
  };
}
