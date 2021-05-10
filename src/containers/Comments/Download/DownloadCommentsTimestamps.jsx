import React, { useState } from "react";
import DownloadJSON from "src/components/DownloadJSON";
import { useDownloadCommentsTimestamps } from "./hooks";
import { Spinner, Link } from "pi-ui";
import { loadCommentsTimestamps } from "src/lib/local_storage";

const DownloadCommentsTimestampsWrapper = ({
  label,
  recordToken,
  commentsCount
}) => {
  const [start, setStart] = useState(false);

  const ts = loadCommentsTimestamps(recordToken);
  const hasLoadedTimestamps =
    ts && Object.keys(ts.comments).length === commentsCount;

  return start || hasLoadedTimestamps ? (
    <DownloadCommentsTimestamps recordToken={recordToken} />
  ) : (
    <Link onClick={() => setStart(true)}>{label}</Link>
  );
};

const DownloadCommentsTimestamps = ({ recordToken }) => {
  const { loading, progress, timestamps } =
    useDownloadCommentsTimestamps(recordToken);

  return loading ? (
    <div>
      <span style={{ marginRight: 10 }}>{progress}%</span>
      <Spinner invert />
    </div>
  ) : timestamps ? (
    <DownloadJSON
      label={"Comments Timestamps"}
      fileName={`${recordToken}-comments-timestamps`}
      content={timestamps}
    />
  ) : null;
};

export default DownloadCommentsTimestampsWrapper;
