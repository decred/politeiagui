import React from "react";
import {
  MarkdownRenderer,
  RecordCard,
  RecordToken,
} from "@politeiagui/common-ui";
import { decodeProposalRecord } from "./utils";
import {
  ProposalMetadata,
  ProposalStatusBar,
  ProposalStatusTag,
  ProposalSubtitle,
} from "./common";
import { Button, ButtonIcon, Dropdown, DropdownItem } from "pi-ui";
import { getShortToken } from "@politeiagui/core/records/utils";
import fileDownload from "js-file-download";
import styles from "./styles.module.css";

const ProposalDownloads = ({ record, onFetchRecordTimestamps }) => {
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

  async function handleFetchTimestamps() {
    const timestamps = await onFetchRecordTimestamps({ token, version });
    return handleDownload(timestamps, `${shortToken}-v${version}-timestamps`)();
  }

  return (
    <Dropdown title="Available Downloads">
      <DropdownItem
        onClick={handleDownload(record, `${shortToken}-v${version}`)}
      >
        Proposal Bundle
      </DropdownItem>
      <DropdownItem onClick={handleFetchTimestamps}>
        Proposal Timestamps
      </DropdownItem>
      {/* TODO: Add comments downloads (bundle & timestamps) */}
    </Dropdown>
  );
};

const ProposalDetails = ({ record, voteSummary, onFetchTimestamps }) => {
  const proposalDetails = decodeProposalRecord(record);
  function handleShowRawMarkdown() {
    window.location.pathname = `/record/${getShortToken(
      proposalDetails.token
    )}/raw`;
  }
  return (
    <div>
      <RecordCard
        token={proposalDetails.token}
        title={proposalDetails.name}
        subtitle={
          <ProposalSubtitle
            userid={proposalDetails.author.userid}
            username={proposalDetails.author.username}
            publishedat={proposalDetails.timestamps.publishedat}
            editedat={proposalDetails.timestamps.editedat}
            token={proposalDetails.token}
            version={proposalDetails.version}
          />
        }
        rightHeader={
          <ProposalStatusTag record={record} voteSummary={voteSummary} />
        }
        secondRow={
          <div className={styles.secondRow}>
            <RecordToken token={proposalDetails.token} isCopyable={true} />
            <ProposalStatusBar voteSummary={voteSummary} />
            <ProposalMetadata metadata={proposalDetails.proposalMetadata} />
          </div>
        }
        thirdRow={<MarkdownRenderer body={proposalDetails.body} />}
        fourthRow={
          <>
            <Button>Click Me</Button>
            <Button kind="secondary"> Click Again</Button>
          </>
        }
        footer={
          <>
            <ProposalDownloads
              record={record}
              onFetchRecordTimestamps={onFetchTimestamps}
            />
            <div className={styles.footerButtons}>
              <ButtonIcon
                type="markdown"
                onClick={handleShowRawMarkdown}
                viewBox="0 0 208 128"
              />
              <ButtonIcon type="link" onClick={handleShowRawMarkdown} />
            </div>
          </>
        }
      />
    </div>
  );
};

export default ProposalDetails;
