import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dropdown, DropdownItem, Spinner } from "pi-ui";
import { useProposalDownloads } from "../../../pi/downloads/useProposalDownloads";
import styles from "./styles.module.css";

const DownloadItem = ({ onDownload, children, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);
  async function handleDownload() {
    setIsLoading(true);
    await onDownload();
    setIsLoading(false);
  }
  return (
    <DropdownItem
      onClick={handleDownload}
      className={styles.downloadItem}
      disabled={isLoading}
      {...props}
    >
      <div className={styles.downloadLabel}>{children}</div>
      <div className={styles.downloadSpinner}>
        {isLoading && <Spinner invert />}
      </div>
    </DropdownItem>
  );
};

const ProposalDownloads = ({ token, version, title, headerClassName }) => {
  const {
    onDownloadCommentsBundle,
    onDownloadRecordBundle,
    onDownloadVotesBundle,
    onFetchCommentsTimestamps,
    onFetchRecordTimestamps,
    onFetchVotesTimestamps,
  } = useProposalDownloads({ token, version });

  return (
    <Dropdown
      data-testid="proposal-downloads"
      title={title}
      closeOnItemClick={false}
      dropdownHeaderClassName={headerClassName}
    >
      <DownloadItem
        data-testid="proposal-downloads-record-bundle"
        onDownload={onDownloadRecordBundle}
      >
        Proposal Bundle
      </DownloadItem>
      {onFetchRecordTimestamps && (
        <DownloadItem
          data-testid="proposal-downloads-record-timestamps"
          onDownload={onFetchRecordTimestamps}
        >
          Proposal Timestamps
        </DownloadItem>
      )}
      {onDownloadCommentsBundle && (
        <DownloadItem
          data-testid="proposal-downloads-comments-bundle"
          onDownload={onDownloadCommentsBundle}
        >
          Comments Bundle
        </DownloadItem>
      )}
      {onFetchCommentsTimestamps && (
        <DownloadItem
          data-testid="proposal-downloads-comments-timestamps"
          onDownload={onFetchCommentsTimestamps}
        >
          Comments Timestamps
        </DownloadItem>
      )}
      {onDownloadVotesBundle && (
        <DownloadItem
          data-testid="proposal-downloads-votes-bundle"
          onDownload={onDownloadVotesBundle}
        >
          Votes Bundle
        </DownloadItem>
      )}
      {onFetchVotesTimestamps && (
        <DownloadItem
          data-testid="proposal-downloads-votes-timestamps"
          onDownload={onFetchVotesTimestamps}
        >
          Votes Timestamps
        </DownloadItem>
      )}
    </Dropdown>
  );
};

ProposalDownloads.propTypes = {
  token: PropTypes.string.isRequired,
  version: PropTypes.number,
  title: PropTypes.string,
  record: PropTypes.object,
};

ProposalDownloads.defaultProps = {
  title: "Available Downloads",
};

export default ProposalDownloads;
