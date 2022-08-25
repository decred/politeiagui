import React from "react";
import PropTypes from "prop-types";
import { Dropdown, DropdownItem } from "pi-ui";
import { downloadJSON } from "@politeiagui/core/downloads";
import { getShortToken } from "@politeiagui/core/records/utils";

const ProposalDownloads = ({
  onFetchRecordTimestamps,
  onFetchCommentsTimestamps,
  onDownloadCommentsBundle,
  record,
  title,
  headerClassName,
}) => {
  if (!record) return;

  const {
    version,
    censorshiprecord: { token },
  } = record;

  function handleDownloadRecordBundle() {
    const { detailsFetched: _, ...recordToDownload } = record;
    downloadJSON(
      recordToDownload,
      `${getShortToken(token)}-v${version}-record-bundle`
    );
  }
  return (
    <Dropdown
      data-testid="proposal-downloads"
      title={title}
      closeOnItemClick={false}
      dropdownHeaderClassName={headerClassName}
    >
      <DropdownItem onClick={handleDownloadRecordBundle}>
        Proposal Bundle
      </DropdownItem>
      {onFetchRecordTimestamps && (
        <DropdownItem onClick={() => onFetchRecordTimestamps(version)}>
          Proposal Timestamps
        </DropdownItem>
      )}
      {onDownloadCommentsBundle && (
        <DropdownItem onClick={onDownloadCommentsBundle}>
          Comments Bundle
        </DropdownItem>
      )}
      {onFetchCommentsTimestamps && (
        <DropdownItem onClick={onFetchCommentsTimestamps}>
          Comments Timestamps
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
