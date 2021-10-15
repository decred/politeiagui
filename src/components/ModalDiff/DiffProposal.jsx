import React, { useState, useEffect, useMemo } from "react";
import { Spinner, Tab, Tabs } from "pi-ui";
import PropTypes from "prop-types";
import { DiffHTML, FilesDiff, DiffText } from "src/components/Diff/Diff";
import CompareVersionSelector from "./CompareVersionSelector";
import TimestampTitle from "./TimestampTitle";
import {
  Header,
  Title,
  Author,
  JoinTitle,
  DownloadTimestamps
} from "src/components/RecordWrapper";
import styles from "./ModalDiff.module.css";
import { useCompareVersionSelector } from "./hooks";

const DiffProposal = ({ latest, initVersion, token, ...props }) => {
  const {
    baseVersion,
    compareVersion,
    changedVersion,
    baseProposal,
    compareProposal,
    loading
  } = useCompareVersionSelector(initVersion, token);

  const isDiffAvailable = useMemo(() => {
    return (
      !!baseProposal.details &&
      !!compareProposal.details &&
      !loading
    );
  }, [baseProposal, compareProposal, loading]);

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
        }
      />
      <CompareVersionSelector
        latest={latest}
        onChange={changedVersion}
        base={baseVersion}
        compare={compareVersion}
      />
      {isDiffAvailable ? (
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
              <JoinTitle className="margin-top-s" separatorSymbol=":">
                <Author
                  username={compareProposal.details.username}
                  url={`/user/${compareProposal.details.userid}`}
                />
                <JoinTitle separatorSymbol="-">
                  {baseVersion > 0 && (
                    <TimestampTitle proposal={baseProposal.details} />
                  )}
                  <TimestampTitle proposal={compareProposal.details} />
                </JoinTitle>
              </JoinTitle>
            }
          />
          <span>
            Download the timestamps for &nbsp;
            {baseVersion > 0 && (
              <>
                <DownloadTimestamps
                  label={`version ${baseProposal.details.version}`}
                  version={baseProposal.details.version}
                  token={token}
                />
                &nbsp; or &nbsp;
              </>
            )}
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
