import React from "react";
import voteStatsConnector from "../connectors/voteStats";
import StackedBarChart from "./StackedBarChart";
import { getRandomColor } from "../helpers";
import { PROPOSAL_VOTING_ACTIVE, PROPOSAL_VOTING_FINISHED, PROPOSAL_VOTING_NOT_STARTED } from "../constants";


const mapVoteStatusToMessage = {
  [PROPOSAL_VOTING_ACTIVE]: "Proposal voting active",
  [PROPOSAL_VOTING_FINISHED]: "Proposal voting finished",
  [PROPOSAL_VOTING_NOT_STARTED]: "Proposal voting not started"
};

const VoteStatusLabel = ({ status }) => {
  const spanStyle = {
    fontWeight: "bold"
  };
  const mapVoteStatusToLabel = {
    [PROPOSAL_VOTING_ACTIVE]: (
      <span style={{
        ...spanStyle,
        color: "#41bf53"
      }}>
        {mapVoteStatusToMessage[status]}
      </span>
    ),
    [PROPOSAL_VOTING_FINISHED]: (
      <span style={{
        ...spanStyle,
        color: "#bf4153"
      }}>
        {mapVoteStatusToMessage[status]}
      </span>
    ),
    [PROPOSAL_VOTING_NOT_STARTED]: (
      <span style={{
        ...spanStyle,
        color: "#586D82"
      }}>
        {mapVoteStatusToMessage[status]}
      </span>
    )
  };
  return mapVoteStatusToLabel[status] || null;
};

const getPercentage = (received, total) => Number.parseFloat((received/total)*100).toFixed(2);
const sortOptionYesFirst = a => a.id === "yes" ? -1 : 1;

class Stats extends React.Component {
  getColor = optionId => {
    switch(optionId) {
    case "yes":
      return "#def9f7";
    case "no":
      return "#FFF";
    default:
      return getRandomColor();
    }
  }
  canShowStats = (status, totalVotes) =>
    (status === PROPOSAL_VOTING_ACTIVE || status === PROPOSAL_VOTING_FINISHED) &&
    totalVotes > 0
  transformOptionsResult = (totalVotes, optionsResult = []) =>
    optionsResult
      .map(({ option, votesreceived }) => ({
        id: option.id,
        description: option.description,
        votesReceived: votesreceived,
        percentage: getPercentage(votesreceived, totalVotes),
        color: this.getColor(option.id)
      })).sort(sortOptionYesFirst)
  renderStats = (option) => {
    const optionStyle = {
      display: "flex",
      marginRight: "8px"
    };
    const optionIdStyle = {
      textTransform: "uppercase",
      fontWeight: "bold",
      marginRight: "4px"
    };
    return (
      <div key={`option-${option.id}`} style={optionStyle} >
        <span style={optionIdStyle} >{`${option.id}:`}</span>
        <span>{`${option.votesReceived} votes    `}</span>
      </div>
    );
  };
  getChartData = (options) =>
    options.map(op => ({
      label: op.id,
      value: op.percentage,
      color: op.color
    }))
  renderOptionsStats = (totalVotes, optionsResult) => {
    const { status } = this.props;
    const showStats = this.canShowStats(status, totalVotes);
    const options = optionsResult ? this.transformOptionsResult(totalVotes, optionsResult) : [];

    const headerStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    };
    const bodyStyle = { marginTop: "5px" };

    return (
      <div>
        <div
          style={headerStyle}
        >
          <VoteStatusLabel status={status} />
          {showStats && options.map(op => this.renderStats(op))}
        </div>
        {showStats ?
          <StackedBarChart
            displayValuesForLabel="yes"
            style={{ ...bodyStyle, maxWidth: "400px" }}
            data={this.getChartData(options)}
          /> :
          status !== PROPOSAL_VOTING_NOT_STARTED ?
            <div
              style={bodyStyle}
            >
              This proposal has not received any votes
            </div>
            : null
        }
      </div>
    );
  }
  render() {
    const { totalVotes, optionsResult } = this.props;
    return this.renderOptionsStats(totalVotes, optionsResult);
  }
}

class VoteStats extends React.Component {
  render() {
    const { token, getVoteStatus } = this.props;
    const { optionsresult, status, totalvotes } = getVoteStatus(token);
    const wrapperStyle = {
      display: "flex",
      flexDirection: "column",
      padding: "10px",
      border: "1px solid #bbb",
      marginTop: "10px",
      borderRadius: "8px",
      maxWidth: "400px"
    };
    return(
      <div style={wrapperStyle}>
        <Stats status={status} optionsResult={optionsresult} totalVotes={totalvotes} />
      </div>
    );
  }
}

export default voteStatsConnector(VoteStats);
