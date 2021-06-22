import React, { useState } from "react";
import PropTypes from "prop-types";
import DownloadJSON from "src/components/DownloadJSON";
import { useDownloadVoteTimestamps } from "./hooks";
import { Spinner, Link } from "pi-ui";
import { loadVotesTimestamps } from "src/lib/local_storage";

const DownloadVotesTimestampsWrapper = ({ label, recordToken, votesCount }) => {
  const [start, setStart] = useState(false);

  const ts = loadVotesTimestamps(recordToken);
  const hasProofs = ts?.votes?.reduce(
    (acc, v) => acc && v.proofs.length > 0,
    true
  );
  const hasLoadedTimestamps = ts?.votes?.length === votesCount && hasProofs;

  return start || hasLoadedTimestamps ? (
    <DownloadVotesTimestamps
      recordToken={recordToken}
      votesCount={votesCount}
    />
  ) : (
    <Link onClick={() => setStart(true)}>{label}</Link>
  );
};

const DownloadVotesTimestamps = ({ recordToken, votesCount }) => {
  const { timestamps, progress, loading, error, multiPage } =
    useDownloadVoteTimestamps(recordToken, votesCount);

  return loading ? (
    <div>
      {multiPage ? <span style={{ marginRight: 10 }}>{progress}%</span> : <></>}
      <Spinner invert />
    </div>
  ) : timestamps ? (
    <DownloadJSON
      label={"Votes Timestamps"}
      fileName={`${recordToken}-votes-timestamps`}
      content={timestamps}
    />
  ) : error ? (
    <div>error: {error}</div>
  ) : null;
};

DownloadVotesTimestamps.propTypes = {
  recordToken: PropTypes.string
};

export default DownloadVotesTimestampsWrapper;
