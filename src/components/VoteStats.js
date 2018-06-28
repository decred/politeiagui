import React from "react";
import connector from "../connectors/voteStats";
import PieChart from "react-minimal-pie-chart";
import { PROPOSAL_VOTING_ACTIVE, PROPOSAL_VOTING_FINISHED, PROPOSAL_VOTING_NOT_STARTED } from "../constants";


const mapVoteStatusToMessage = {
  [PROPOSAL_VOTING_ACTIVE]: "Proposal voting active",
  [PROPOSAL_VOTING_FINISHED]: "Proposa voting finished",
  [PROPOSAL_VOTING_NOT_STARTED]: "Proposal voting not started"
};

const VoteStatusLabel = ({ status }) => {
  const mapVoteStatusToLabel = {
    [PROPOSAL_VOTING_ACTIVE]: (
      <span style={{
        color: "#41bf53"
      }}>
        {mapVoteStatusToMessage[status]}
      </span>
    ),
    [PROPOSAL_VOTING_FINISHED]: (
      <span style={{
        color: "#bf4153"
      }}>
        {mapVoteStatusToMessage[status]}
      </span>
    ),
    [PROPOSAL_VOTING_NOT_STARTED]: (
      <span style={{
        color: "#586D82"
      }}>
        {mapVoteStatusToMessage[status]}
      </span>
    )
  };
  return mapVoteStatusToLabel[status] || null;
};

class Stats extends React.Component {
  transformOptionsResult = (totalVotes, optionsResult = []) =>
    optionsResult.map(({ option, votesreceived }) => ({
      id: option.id,
      description: option.description,
      votesReceived: votesreceived,
      percentage: (votesreceived/totalVotes).toFixed(2)*100,
      color: option.id == "yes" ? "#41bf53" : "#bf4153"
    }))
  renderStats = (option) => {
    const optionStyle = {
      marginTop: "10px"
    };
    const optionIdStyle = {
      textTransform: "uppercase"
    };
    return (
      <div key={`option-${option.id}`} style={optionStyle} >
        <h2 style={optionIdStyle} >{`${option.id} ${option.percentage}%`}</h2>
        <span>{`Votes received: ${option.votesReceived}`}</span>
      </div>
    );
  };
  getPieCharData = (options) =>
    options.map(op => ({
      value: 5,
      color: op.color
    }))
  renderOptionsStats = (totalVotes, optionsResult) => {
    const options = this.transformOptionsResult(totalVotes, optionsResult);
    return (
      <div style={{ display: "flex" }}>
        <div>{options.map(op => this.renderStats(op))}</div>
        <div style={{ width: "100%", maxHeight: "100px", display: "flex", justifyContent: "center" }}>
          <PieChart data={this.getPieCharData(options)} />
        </div>
      </div>
    );
  }
  render() {
    const { totalVotes, optionsResult } = this.props;
    return totalVotes ?
      this.renderOptionsStats(totalVotes, optionsResult) :
      <span>This proposal has not received any votes yet</span>;
  }
}

class VoteStats extends React.Component {
  canShowStats = status =>
    status === PROPOSAL_VOTING_ACTIVE || status === PROPOSAL_VOTING_FINISHED
  render() {
    const { token, getVoteStatus } = this.props;
    const { optionsresult, status, totalvotes } = getVoteStatus(token);
    console.log(getVoteStatus(token));
    const wrapperStyle = {
      display: "flex",
      flexDirection: "column",
      padding: "5px",
      border: "1px solid #bbb",
      marginTop: "10px"
    };
    return(
      <div style={wrapperStyle}>
        <VoteStatusLabel status={status} />
        {this.canShowStats(status) && <Stats optionsResult={optionsresult} totalVotes={totalvotes} />}
      </div>
    );
  }
}

export default connector(VoteStats);
