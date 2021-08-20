import { Event, JoinTitle } from "../RecordWrapper";
import React from "react";
import PropTypes from "prop-types";

const TimestampTitle = ({ proposal }) => {
  return (
    <JoinTitle>
      {proposal.timestamp !== proposal.publishedat &&
        proposal.timestamp !== proposal.abandonedat && (
          <Event
            className="margin-left-s margin-right-s"
            event="edited"
            timestamp={proposal.timestamp}
          />
        )}
      {proposal.abandonedat && (
        <Event
          className="margin-left-s margin-right-s"
          event="abandoned"
          timestamp={proposal.abandonedat}
        />
      )}
    </JoinTitle>
  );
};
TimestampTitle.propTypes = {
  proposal: PropTypes.object.isRequired
};

export default TimestampTitle;
