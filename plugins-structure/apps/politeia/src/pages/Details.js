import React from "react";
import {
  TicketvoteRecordVoteDetailsWrapper,
  TicketvoteRecordVoteResultsWrapper,
  TicketvoteRecordVoteTimestampsWrapper,
  TicketvoteSummariesWrapper,
  TicketvoteRecordVoteStatusBar,
} from "@politeiagui/ticketvote/ui";

const ProposalDetails = ({ token }) => {
  return (
    <div>
      <h1>Proposal {token}</h1>
      <TicketvoteRecordVoteDetailsWrapper token={token}>
        {({ ticketvoteDetails, onFetchTicketvoteDetails }) => (
          <div>
            <h1>Vote Details:</h1>
            {!ticketvoteDetails && (
              <button onClick={() => onFetchTicketvoteDetails()}>Fetch</button>
            )}
            <div>{JSON.stringify(ticketvoteDetails)}</div>
          </div>
        )}
      </TicketvoteRecordVoteDetailsWrapper>
      <TicketvoteRecordVoteResultsWrapper token={token}>
        {({ ticketvoteResults, onFetchTicketvoteResults }) => (
          <div>
            <h1>Vote Results:</h1>
            {!ticketvoteResults && (
              <button onClick={() => onFetchTicketvoteResults()}>Fetch</button>
            )}
            <div>{JSON.stringify(ticketvoteResults)}</div>
          </div>
        )}
      </TicketvoteRecordVoteResultsWrapper>
      <TicketvoteRecordVoteTimestampsWrapper token={token}>
        {({ ticketvoteTimestamps, onFetchTicketvoteTimestamps }) => (
          <div>
            <h1>Vote Timestamps:</h1>
            {!ticketvoteTimestamps && (
              <button onClick={() => onFetchTicketvoteTimestamps()}>
                Fetch
              </button>
            )}
            <div>{JSON.stringify(ticketvoteTimestamps)}</div>
          </div>
        )}
      </TicketvoteRecordVoteTimestampsWrapper>
      <TicketvoteSummariesWrapper tokens={[token]}>
        {(props) => <TicketvoteRecordVoteStatusBar {...props} />}
      </TicketvoteSummariesWrapper>
    </div>
  );
};

export default ProposalDetails;
