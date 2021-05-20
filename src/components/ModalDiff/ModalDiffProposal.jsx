import React, { useState, useEffect } from "react";
import { Modal, Text, Tab, Tabs } from "pi-ui";
import PropTypes from "prop-types";
import { DiffHTML, FilesDiff, DiffText } from "src/components/Diff/Diff";
import {
  Header,
  Title,
  Author,
  Event,
  Subtitle,
  DownloadTimestamps
} from "src/components/RecordWrapper";
import styles from "./ModalDiff.module.css";

const ModalDiffProposal = ({
  onClose,
  oldText,
  newText,
  oldFiles,
  newFiles,
  newTitle,
  oldTitle,
  proposalDetails,
  ...props
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  useEffect(() => {
    setActiveTabIndex(0);
  }, [props.show]);
  return (
    <Modal
      onClose={onClose}
      {...props}
      contentStyle={{ width: "100%", minHeight: "40rem" }}>
      <Header
        title={
          <Title id={"proposal-title-gfsag"} truncate linesBeforeTruncate={2}>
            <DiffText oldText={oldTitle} newText={newTitle} />
          </Title>
        }
        subtitle={
          <Subtitle>
            <Author
              username={proposalDetails.username}
              url={`/user/${proposalDetails.userid}`}
            />
            {proposalDetails.timestamp !== proposalDetails.publishedat &&
              proposalDetails.timestamp !== proposalDetails.abandonedat && (
                <Event event="edited" timestamp={proposalDetails.timestamp} />
              )}
            {proposalDetails.abandonedat && (
              <Event
                event={"abandoned"}
                timestamp={proposalDetails.abandonedat}
              />
            )}
            {proposalDetails.version && (
              <Text
                id={`proposal-${proposalDetails.proposalToken}-version`}
                className={
                  styles.version
                }>{`version ${proposalDetails.version}`}</Text>
            )}
          </Subtitle>
        }
      />
      <DownloadTimestamps
        label="Download the timestamps for this version"
        version={proposalDetails.version}
        token={proposalDetails.censorshiprecord.token}
      />
      <Tabs
        onSelectTab={setActiveTabIndex}
        activeTabIndex={activeTabIndex}
        className={styles.diffTabs}
        contentClassName={styles.diffTabContent}>
        <Tab label="Text Changes">
          <DiffHTML oldTextBody={oldText} newTextBody={newText} />
        </Tab>
        <Tab label="Attachments Changes">
          <FilesDiff oldFiles={oldFiles} newFiles={newFiles} />
        </Tab>
      </Tabs>
    </Modal>
  );
};
ModalDiffProposal.propTypes = {
  onClose: PropTypes.func.isRequired,
  oldText: PropTypes.string,
  newText: PropTypes.string,
  oldFiles: PropTypes.array,
  newFiles: PropTypes.array,
  proposalDetails: PropTypes.object
};

export default ModalDiffProposal;
