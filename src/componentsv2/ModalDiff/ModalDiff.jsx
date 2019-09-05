import React, { useState } from "react";
import { Modal, Text, Tab, Tabs } from "pi-ui";
import PropTypes from "prop-types";
import { insertDiffHTML, insertFilesDiff } from "src/componentsv2/Diff/Diff";
import { Header, Title, Author, Event, Subtitle } from "src/componentsv2/RecordWrapper";
import styles from "./ModalDiff.module.css";

const ModalDiff = ({
  onClose,
  oldText,
  newText,
  oldFiles,
  newFiles,
  proposalDetails,
  ...props
}) => {
  const diffFiles = insertFilesDiff(oldFiles, newFiles);
  const diff = insertDiffHTML(oldText, newText);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <Modal
      onClose={onClose}
      {...props}
      contentStyle={{ width: "100%", minHeight: "40rem" }}
    >
      <Header
        title={
          <Title
            id={"proposal-title-gfsag"}
            truncate
            linesBeforeTruncate={2}
          >

            {proposalDetails.name}
          </Title>
        }
        subtitle={
          <Subtitle>
            <Author username={proposalDetails.username} id={proposalDetails.userid} />
            {proposalDetails.timestamp !== proposalDetails.publishedat &&
              proposalDetails.timestamp !== proposalDetails.abandonedat && (
              <Event event="edited" timestamp={proposalDetails.timestamp} />
            )}
            {proposalDetails.abandonedat && (
              <Event event={"abandoned"} timestamp={proposalDetails.abandonedat} />
            )}
            {proposalDetails.version && (
              <Text
                id={`proposal-${proposalDetails.proposalToken}-version`}
                color="gray"
                className={styles.version}
              >{`version ${proposalDetails.version}`}</Text>
            )}
          </Subtitle>
        }
      />
      <Tabs
        onSelectTab={setActiveTabIndex}
        activeTabIndex={activeTabIndex}
        className={styles.diffTabs}
      >
        <Tab label="Text Changes">
          {diff}
        </Tab>
        <Tab label="Attachments Changes">
          {diffFiles}
        </Tab>
      </Tabs>
    </Modal>
  );
};
ModalDiff.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  oldText: PropTypes.string.isRequired,
  newText: PropTypes.string.isRequired
};

export default ModalDiff;
