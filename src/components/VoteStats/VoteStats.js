import React from "react";
import voteStatsConnector from "src/connectors/voteStats";
import Stats from "./StatsDisplay";
import "./styles.css";

const VoteStats = ({ token, getVoteStatus }) => {
  const {
    optionsresult,
    status,
    totalvotes,
    endheight,
    quorumpercentage,
    passpercentage,
    numofeligiblevotes,
    bestblock
  } = getVoteStatus(token) || {};

  return (
    <div className="voteStatsWrapper">
      <Stats
        status={status}
        optionsResult={optionsresult}
        totalVotes={totalvotes}
        endHeight={endheight}
        quorumPercentage={quorumpercentage}
        passPercentage={passpercentage}
        numOfEligibleVotes={numofeligiblevotes}
        currentHeight={bestblock}
      />
    </div>
  );
};

export default voteStatsConnector(VoteStats);
