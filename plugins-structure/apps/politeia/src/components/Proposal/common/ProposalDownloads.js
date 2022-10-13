import React from "react";
import PropTypes from "prop-types";
import { Dropdown, DropdownItem } from "pi-ui";
import { useProposalDownloads } from "../../../pi/downloads/useProposalDownloads";

const ProposalDownloads = ({ token, version, title, headerClassName }) => {
  const {
    onDownloadCommentsBundle,
    onDownloadRecordBundle,
    onDownloadVotesBundle,
    onFetchCommentsTimestamps,
    onFetchRecordTimestamps,
    onFetchVotesTimestamps,
  } = useProposalDownloads({ token });

  return (
    <Dropdown
      data-testid="proposal-downloads"
      title={title}
      closeOnItemClick={false}
      dropdownHeaderClassName={headerClassName}
    >
      <DropdownItem
        data-testid="proposal-downloads-record-bundle"
        onClick={onDownloadRecordBundle}
      >
        Proposal Bundle
      </DropdownItem>
      {onFetchRecordTimestamps && (
        <DropdownItem
          data-testid="proposal-downloads-record-timestamps"
          onClick={() => onFetchRecordTimestamps(version)}
        >
          Proposal Timestamps
        </DropdownItem>
      )}
      {onDownloadCommentsBundle && (
        <DropdownItem
          data-testid="proposal-downloads-comments-bundle"
          onClick={onDownloadCommentsBundle}
        >
          Comments Bundle
        </DropdownItem>
      )}
      {onFetchCommentsTimestamps && (
        <DropdownItem
          data-testid="proposal-downloads-comments-timestamps"
          onClick={onFetchCommentsTimestamps}
        >
          Comments Timestamps
        </DropdownItem>
      )}
      {onDownloadVotesBundle && (
        <DropdownItem
          data-testid="proposal-downloads-votes-bundle"
          onClick={() => onDownloadVotesBundle()}
        >
          Votes Bundle
        </DropdownItem>
      )}
      {onFetchVotesTimestamps && (
        <DropdownItem
          data-testid="proposal-downloads-votes-timestamps"
          onClick={onFetchVotesTimestamps}
        >
          Votes Timestamps
        </DropdownItem>
      )}
    </Dropdown>
  );
};

ProposalDownloads.propTypes = {
  onFetchRecordTimestamps: PropTypes.func,
  title: PropTypes.string,
  record: PropTypes.object,
};

ProposalDownloads.defaultProps = {
  title: "Available Downloads",
};

export default ProposalDownloads;
