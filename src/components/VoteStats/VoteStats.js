import React, { useState } from "react";
import DynamicDataDisplay from "../DynamicDataDisplay";
import voteStatsConnector from "src/connectors/voteStats";
import Stats from "./StatsDisplay";
import "./styles.css";
import { PROPOSAL_VOTING_ACTIVE } from "../../constants";

const VoteStats = ({
  onFetchVoteStatus,
  token,
  lastBlockHeight,
  getVoteStatus
}) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetchVoteStats = async () => {
    // do not fetch again if it is already fetched before unless it is an
    // active voting, in that case we can benefit from a data refresh
    const voteStats = getVoteStatus(token) || {};
    const voteStatsAlreadyFetched = Object.keys(voteStats).length > 0;
    const votingActive = voteStats.status === PROPOSAL_VOTING_ACTIVE;
    if (!votingActive && voteStatsAlreadyFetched) return;

    try {
      setLoading(true);
      await onFetchVoteStatus(token);
      setLoading(false);
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  };

  const {
    optionsresult,
    status,
    totalvotes,
    endheight,
    quorumpercentage,
    passpercentage,
    numofeligiblevotes
  } = getVoteStatus(token) || {};

  return (
    <div className="voteStatsWrapper">
      <DynamicDataDisplay
        onFetch={handleFetchVoteStats}
        error={error}
        refreshTriggers={[token]}
        isLoading={loading}
        loadingMessage="Fetching vote stats..."
      >
        <Stats
          status={status}
          optionsResult={optionsresult}
          totalVotes={totalvotes}
          endHeight={endheight}
          quorumPercentage={quorumpercentage}
          passPercentage={passpercentage}
          numOfEligibleVotes={numofeligiblevotes}
          currentHeight={lastBlockHeight}
        />
      </DynamicDataDisplay>
    </div>
  );
};

export default voteStatsConnector(VoteStats);
