import React from "react";

class VoteStats extends React.Component {
  getOptionVoteInfo = (votes, options) => {
    const result = options.map(op => {
      const votesReiceved = votes.filter(v => parseInt(v.votebit) === parseInt(op.bits)).length;
      const percentage = (votesReiceved/votes.length).toFixed(2)*100;
      return {
        id: op.id,
        description: op.description,
        votesReiceved,
        percentage
      };
    });
    return result;
  }
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
        <span>{`Votes received: ${option.votesReiceved}`}</span>
      </div>
    );
  };
  render() {
    const { castedVotes, voteDetails } = this.props;
    const voteStats = this.getOptionVoteInfo(castedVotes, voteDetails.Options);
    const wrapperStyle = {
      display: "flex",
      flexDirection: "column",
      padding: "10px",
      border: "1px solid #0079d3",
      marginTop: "10px"
    };
    return(
      <div style={wrapperStyle}>
        <h3>Voting Stats</h3>
        <span>{`Total votes: ${castedVotes.length}`}</span>
        {
          castedVotes.length > 0 ? voteStats.map(option => this.renderStats(option)) :
            "This proposal has not received any votes yet"
        }
      </div>
    );
  }
}

export default VoteStats;
