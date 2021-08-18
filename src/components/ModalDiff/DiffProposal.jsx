import React, { useState, useEffect } from "react";
import { Spinner, Tab, Tabs } from "pi-ui";
import PropTypes from "prop-types";
import { DiffHTML, FilesDiff, DiffText } from "src/components/Diff/Diff";
import CompareVersionSelector from "./CompareVersionSelector";
import {
  Header,
  Title,
  Author,
  Event,
  Subtitle,
  DownloadTimestamps
} from "src/components/RecordWrapper";
import styles from "./ModalDiff.module.css";
import { useCompareVersionSelector } from "./hook";

const DiffProposal = ({ latest, initVersion, token, ...props }) => {
  const {
    baseVersion,
    compareVersion,
    baseLoading,
    compareLoading,
    changedVersion,
    baseProposal,
    compareProposal
  } = useCompareVersionSelector(initVersion, latest, token);

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  useEffect(() => {
    setActiveTabIndex(0);
  }, [props.show]);
  return (
    <>
      <Header
        title={<Title>Compare changes</Title>}
        subtitle={
          <p className={styles.headerSubtitle}>
            Compare changes across different versions of the record.
          </p>
        }/>
      <CompareVersionSelector
        latest={latest}
        onChange={changedVersion}
        base={baseVersion}
        compare={compareVersion}
        baseLoading={baseLoading}
        compareLoading={compareLoading}
      />
      {!!baseProposal.details &&
      !!compareProposal.details &&
      !baseLoading &&
      !compareLoading ? (
        <>
          <Header
            title={
              <p className={styles.titleDiff}>
                <DiffText
                  oldText={baseProposal.title}
                  newText={compareProposal.title}
                />
              </p>
            }
            subtitle={
              <Subtitle>
                <Author
                  username={compareProposal.details.username}
                  url={`/user/${compareProposal.details.userid}`}
                />
                <span>
                  {baseProposal.details.timestamp !==
                    baseProposal.details.publishedat &&
                    baseProposal.details.timestamp !==
                      baseProposal.details.abandonedat && (
                      <Event
                        className="margin-left-s margin-right-s"
                        event="edited"
                        timestamp={baseProposal.details.timestamp}
                      />
                    )}
                  {baseProposal.details.abandonedat && (
                    <Event
                      className="margin-left-s margin-right-s"
                      event={"abandoned"}
                      timestamp={baseProposal.details.abandonedat}
                    />
                  )}
                  -
                  {compareProposal.details.timestamp !==
                    compareProposal.details.publishedat &&
                    compareProposal.details.timestamp !==
                      compareProposal.details.abandonedat && (
                      <Event
                        className="margin-left-s margin-right-s"
                        event="edited"
                        timestamp={compareProposal.details.timestamp}
                      />
                    )}
                  {compareProposal.details.abandonedat && (
                    <Event
                      className="margin-left-s margin-right-s"
                      event={"abandoned"}
                      timestamp={compareProposal.details.abandonedat}
                    />
                  )}
                </span>
              </Subtitle>
            }
          />
          <span>
            Download the timestamps for &nbsp;
            <DownloadTimestamps
              label={`version ${baseProposal.details.version}`}
              version={baseProposal.details.version}
              token={token}
            />
            &nbsp; or &nbsp;
            <DownloadTimestamps
              label={`version ${compareProposal.details.version}`}
              version={compareProposal.details.version}
              token={token}
            />
          </span>
          <Tabs
            onSelectTab={setActiveTabIndex}
            activeTabIndex={activeTabIndex}
            className={styles.diffTabs}
            contentClassName={styles.diffTabContent}>
            <Tab label="Text Changes">
              <div className={styles.diffWrapper}>
                <DiffHTML
                  oldTextBody={baseProposal.text}
                  newTextBody={compareProposal.text}
                />
              </div>
            </Tab>
            <Tab label="Attachments Changes">
              <FilesDiff
                oldFiles={baseProposal.files}
                newFiles={compareProposal.files}
              />
            </Tab>
          </Tabs>
        </>
      ) : (
        <div className={styles.versionSpinnerContainer}>
          <Spinner width={50} height={50} invert />
        </div>
      )}
    </>
  );
};
DiffProposal.propTypes = {
  latest: PropTypes.number.isRequired,
  initVersion: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired
};

export default DiffProposal;
