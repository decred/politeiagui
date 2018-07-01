import React from "react";
import connector from "../connectors/voteStats";
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

class Stats extends React.Component {
  getColor = optionId => {
    switch(optionId) {
    case "yes":
      return "#2dd8a3";
    case "no":
      return "#091440";
    default:
      return getRandomColor();
    }
  }
  canShowStats = status =>
    status === PROPOSAL_VOTING_ACTIVE || status === PROPOSAL_VOTING_FINISHED
  transformOptionsResult = (totalVotes, optionsResult = []) =>
    optionsResult.map(({ option, votesreceived }) => ({
      id: option.id,
      description: option.description,
      votesReceived: votesreceived,
      percentage: (votesreceived/totalVotes).toFixed(2)*100,
      color: this.getColor(option.id)
    }))
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
  getCharData = (options) =>
    options.map(op => ({
      label: op.id,
      value: op.percentage,
      color: op.color
    }))
  renderOptionsStats = (totalVotes, optionsResult) => {
    const { status } = this.props;
    const showStats = this.canShowStats(status);
    const options = optionsResult ? this.transformOptionsResult(totalVotes, optionsResult) : [];
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 0 5px 0",
            justifyContent: "space-between"
          }}>
          <VoteStatusLabel status={status} />
          {showStats && totalVotes > 0 && options.map(op => this.renderStats(op))}
        </div>
        <div>
          {showStats && totalVotes > 0 ?
            <StackedBarChart
              style={{ maxWidth: "400px" }}
              data={this.getCharData(options)}
            /> :
            status !== PROPOSAL_VOTING_NOT_STARTED ?
              <span>This proposal has not received any votes</span>
              : null
          }
        </div>
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
    console.log(getVoteStatus(token));
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

export default connector(VoteStats);
