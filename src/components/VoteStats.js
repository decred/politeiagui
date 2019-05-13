import React from "react";
import voteStatsConnector from "../connectors/voteStats";
import StackedBarChart from "./StackedBarChart";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import { getRandomColor } from "../helpers";
import Tooltip from "./Tooltip";
import {
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_VOTING_AUTHORIZED
} from "../constants";

const mapVoteStatusToMessage = {
  [PROPOSAL_VOTING_ACTIVE]: "Proposal voting active",
  [PROPOSAL_VOTING_FINISHED]: "Proposal voting finished",
  [PROPOSAL_VOTING_NOT_AUTHORIZED]:
    "Author has not yet authorized the start of voting",
  [PROPOSAL_VOTING_AUTHORIZED]:
    "Waiting for administrator approval to start voting"
};

const VoteStatusLabel = ({ status }) => {
  const spanStyle = {
    fontWeight: "bold"
  };
  const mapVoteStatusToLabel = {
    [PROPOSAL_VOTING_ACTIVE]: (
      <span
        style={{
          ...spanStyle,
          color: "#41bf53"
        }}
      >
        {mapVoteStatusToMessage[status]}
      </span>
    ),
    [PROPOSAL_VOTING_FINISHED]: (
      <span
        style={{
          ...spanStyle,
          color: "#091440"
        }}
      >
        {mapVoteStatusToMessage[status]}
      </span>
    ),
    [PROPOSAL_VOTING_NOT_AUTHORIZED]: (
      <span
        style={{
          ...spanStyle,
          color: "#8997a5"
        }}
      >
        {mapVoteStatusToMessage[status]}
      </span>
    ),
    [PROPOSAL_VOTING_AUTHORIZED]: (
      <span
        style={{
          ...spanStyle,
          color: "#d69400"
        }}
      >
        {mapVoteStatusToMessage[status]}
      </span>
    )
  };
  return mapVoteStatusToLabel[status] || null;
};

const getPercentage = (received, total) =>
  Number.parseFloat((received / total) * 100).toFixed(2);
const sortOptionYesFirst = a => (a.id === "yes" ? -1 : 1);

class Stats extends React.Component {
  getColor = optionId => {
    switch (optionId) {
      case "yes":
        return "#def9f7";
      case "no":
        return "#FFF";
      default:
        return getRandomColor();
    }
  };
  canShowStats = (status, totalVotes) =>
    (status === PROPOSAL_VOTING_ACTIVE ||
      status === PROPOSAL_VOTING_FINISHED) &&
    totalVotes > 0;

  transformOptionsResult = (totalVotes, optionsResult = []) =>
    optionsResult
      .map(({ option, votesreceived }) => ({
        id: option.id,
        description: option.description,
        votesReceived: votesreceived,
        percentage: getPercentage(votesreceived, totalVotes),
        color: this.getColor(option.id)
      }))
      .sort(sortOptionYesFirst);
  renderStats = option => {
    const optionStyle = {
      display: "flex",
      marginRight: "8px"
    };
    const optionIdStyle = {
      textTransform: "uppercase",
      fontWeight: "semibold",
      marginRight: "4px"
    };
    return (
      <span key={`option-${option.id}`} style={optionStyle}>
        {option.id === "yes" ? (
          <Tooltip
            tipStyle={{
              fontSize: "11px",
              top: "20px",
              left: "20px",
              width: "36px"
            }}
            text="Yes"
            position="bottom"
          >
            <span>
              <span style={optionIdStyle}>{` ✔ ${option.votesReceived}`}</span>
            </span>
          </Tooltip>
        ) : (
          <Tooltip
            tipStyle={{
              fontSize: "11px",
              top: "20px",
              left: "20px",
              width: "29px"
            }}
            text="No"
            position="bottom"
          >
            <span style={{ marginRight: "25px" }}>
              <span style={optionIdStyle}>{` ✖ ${option.votesReceived}`}</span>
            </span>
          </Tooltip>
        )}
      </span>
    );
  };
  getChartData = options =>
    options.map(op => ({
      label: op.id,
      value: op.percentage,
      color: op.color
    }));

  getTimeInBlocks = (endHeight, currentHeight) => {
    const blocks = endHeight - currentHeight;
    const blockTimeMinutes = this.props.isTestnet ? blocks * 2 : blocks * 5;
    const mili = blockTimeMinutes * 60000;
    const dateMs = new Date(mili + Date.now()); // gets time in ms
    const distance = distanceInWordsToNow(dateMs, { addSuffix: true });
    const element = (
      <Tooltip
        tipStyle={{
          fontSize: "11px",
          top: "20px",
          left: "20px",
          width: "90px"
        }}
        text={"Voting ends at block #" + endHeight}
        position="bottom"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          <span>
            {blocks === 0 ? "last block left" : blocks + " blocks left"}
          </span>
          <span style={{ fontSize: "11px" }}>vote ends {distance}</span>
        </div>
      </Tooltip>
    );
    return blockTimeMinutes > 0 ? element : <span>finished</span>;
  };
  renderOptionsStats = () => {
    const {
      status,
      totalVotes,
      optionsResult,
      endHeight,
      currentHeight,
      quorumPercentage,
      passPercentage,
      numOfEligibleVotes
    } = this.props;
    const showStats = this.canShowStats(status, totalVotes);
    const options = optionsResult
      ? this.transformOptionsResult(totalVotes, optionsResult)
      : [];
    const isPreVoting =
      status === PROPOSAL_VOTING_NOT_AUTHORIZED ||
      status === PROPOSAL_VOTING_AUTHORIZED;
    const currentQuorumPercentage = getPercentage(
      totalVotes,
      numOfEligibleVotes
    );
    const quorumInVotes = Math.trunc(
      (numOfEligibleVotes * quorumPercentage) / 100
    );

    const headerStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    };
    const detailStyle = {
      color: "gray"
    };

    const bodyStyle = { marginTop: "10px" };
    return (
      <div>
        <div style={headerStyle}>
          <VoteStatusLabel status={status} />
          {showStats && <span style={{ marginLeft: "20px" }}>Votes: </span>}
          {!isPreVoting && !showStats ? (
            <div style={detailStyle}>
              <p>zero votes</p>
            </div>
          ) : null}
          {showStats && options.map(op => this.renderStats(op))}
          {endHeight && currentHeight && !isPreVoting
            ? this.getTimeInBlocks(endHeight, currentHeight)
            : null}
        </div>
        {showStats ? (
          <div style={bodyStyle}>
            <StackedBarChart
              displayValuesForLabel="yes"
              style={{ ...bodyStyle, maxWidth: "500px" }}
              data={this.getChartData(options)}
              threeshold={passPercentage}
            />
            <div style={{ marginTop: "10px", display: "flex" }}>
              Quorum:
              <Tooltip
                tipStyle={{
                  left: "80px",
                  maxWidth: "100px",
                  padding: "6px",
                  textAlign: "center"
                }}
                text={`${currentQuorumPercentage}/${quorumPercentage} %`}
                position="right"
              >
                <span
                  style={{
                    marginLeft: "5px",
                    color: totalVotes < quorumInVotes ? "#FFA07A" : "green"
                  }}
                >
                  {`${totalVotes}/${quorumInVotes} votes`}
                </span>
              </Tooltip>
            </div>
          </div>
        ) : null}
      </div>
    );
  };
  render() {
    return this.renderOptionsStats();
  }
}

class VoteStats extends React.Component {
  render() {
    const { token, getVoteStatus, lastBlockHeight, ...props } = this.props;
    const {
      optionsresult,
      status,
      totalvotes,
      endheight,
      quorumpercentage,
      passpercentage,
      numofeligiblevotes
    } = getVoteStatus(token);
    const wrapperStyle = {
      display: "flex",
      flexDirection: "column",
      padding: "10px",
      border: "1px solid #bbb",
      marginTop: "10px",
      borderRadius: "8px",
      maxWidth: "600px",
      cursor: "default"
    };

    return (
      <div style={wrapperStyle}>
        <Stats
          status={status}
          optionsResult={optionsresult}
          totalVotes={totalvotes}
          endHeight={endheight}
          quorumPercentage={quorumpercentage}
          passPercentage={passpercentage}
          numOfEligibleVotes={numofeligiblevotes}
          currentHeight={lastBlockHeight}
          {...props}
        />
      </div>
    );
  }
}

export default voteStatsConnector(VoteStats);
