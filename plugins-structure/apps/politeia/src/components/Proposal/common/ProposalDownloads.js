import React from "react";
import PropTypes from "prop-types";
import { Dropdown, DropdownItem } from "pi-ui";
import { getShortToken } from "@politeiagui/core/records/utils";
import {
  DownloadCommentsBundle,
  DownloadCommentsTimestamps,
} from "@politeiagui/comments/ui";
import fileDownload from "js-file-download";

const ProposalDownloads = ({
  record,
  onFetchRecordTimestamps,
  title,
  withoutComments,
  headerClassName,
}) => {
  if (!record) return null;

  const { token } = record.censorshiprecord;
  const version = record.version;
  const shortToken = getShortToken(token);

  function handleDownload(data, filename) {
    return function onDownload() {
      const dataString = JSON.stringify(data, null, 2);
      fileDownload(dataString, `${filename}.json`);
    };
  }

  async function handleFetchRecordTimestamps() {
    const timestamps = await onFetchRecordTimestamps({ token, version });
    return handleDownload(timestamps, `${shortToken}-v${version}-timestamps`)();
  }

  return (
    <Dropdown
      data-testid="proposal-downloads"
      title={title}
      closeOnItemClick={false}
      dropdownHeaderClassName={headerClassName}
    >
      <DropdownItem
        onClick={handleDownload(record, `${shortToken}-v${version}`)}
      >
        Proposal Bundle
      </DropdownItem>
      <DropdownItem onClick={handleFetchRecordTimestamps}>
        Proposal Timestamps
      </DropdownItem>
      {!withoutComments && (
        <>
          <DropdownItem>
            <DownloadCommentsBundle
              token={token}
              mode="text"
              label="Comments Bundle"
            />
          </DropdownItem>
          <DropdownItem>
            <DownloadCommentsTimestamps
              token={token}
              mode="text"
              label="Comments Timestamps"
            />
          </DropdownItem>
        </>
      )}
    </Dropdown>
  );
};

ProposalDownloads.propTypes = {
  onFetchRecordTimestamps: PropTypes.func.isRequired,
  record: PropTypes.object,
  title: PropTypes.string,
  withoutComments: PropTypes.bool,
};

ProposalDownloads.defaultProps = {
  title: "Available Downloads",
};

export default ProposalDownloads;
