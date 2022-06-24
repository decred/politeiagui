import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { H2, Icon, Modal, Select, Text } from "pi-ui";
import { records } from "@politeiagui/core/records";
import {
  Event,
  Join,
  MarkdownDiffHTML,
  RecordCard,
  ThumbnailGrid,
} from "@politeiagui/common-ui";
import { decodeProposalRecord, getFilesDiff, getImagesByDigest } from "./utils";
import { ProposalDownloads } from "./common";
import styles from "./ModalProposalDiff.module.css";
import range from "lodash/range";
import isEmpty from "lodash/fp/isEmpty";

function ModalTitle() {
  return (
    <div className={styles.modalHeader}>
      <H2>Compare Changes</H2>
      <Text className={styles.subtitle}>
        Compare record changes across different versions.
      </Text>
    </div>
  );
}

function AttachmentsDiff({ newFiles, oldFiles }) {
  const { added, removed, unchanged } = getFilesDiff(newFiles, oldFiles);
  return (
    ![added, removed, unchanged].every(isEmpty) && (
      <div className={styles.filesDiffWrapper}>
        <ThumbnailGrid
          files={added}
          readOnly
          thumbnailClassName={styles.added}
        />
        <ThumbnailGrid
          files={removed}
          readOnly
          thumbnailClassName={styles.removed}
        />
        <ThumbnailGrid
          files={unchanged}
          readOnly
          thumbnailClassName={styles.unchanged}
        />
      </div>
    )
  );
}

function VersionSelector({ maxVersion, onChange, current, minVersion = 1 }) {
  const options = range(maxVersion, minVersion - 1, -1).map((v) => ({
    label: `version ${v}`,
    value: v,
  }));
  function getValueOption(value) {
    return options.find((op) => op.value === value);
  }
  return (
    <Select
      options={options}
      value={getValueOption(current)}
      onChange={(op) => onChange(op.value)}
      customStyles={{
        container: () => ({
          padding: "0px",
        }),
      }}
    />
  );
}

function VersionsPickers({
  latestVersion,
  newVersion,
  oldVersion,
  setNewVersion,
  setOldVersion,
}) {
  return (
    <div className={styles.versionPickerWrapper}>
      <VersionSelector
        maxVersion={newVersion}
        onChange={setOldVersion}
        current={oldVersion}
      />
      <div className={styles.compareIcon}>
        <Icon type="compare" />
      </div>
      <VersionSelector
        maxVersion={latestVersion}
        onChange={setNewVersion}
        current={newVersion}
        minVersion={oldVersion}
      />
    </div>
  );
}

function VersionsInfo({
  oldProposal,
  newProposal,
  onFetchTimestamps,
  oldRecord,
  newRecord,
}) {
  if (!oldProposal || !newProposal) return null;
  const oldVersion = oldProposal.version;
  const newVersion = newProposal.version;
  const oldTimestamp =
    oldVersion !== 1
      ? oldProposal.timestamps.editedat
      : oldProposal.timestamps.publishedat;
  const newTimestamp =
    newVersion !== 1
      ? newProposal.timestamps.editedat
      : newProposal.timestamps.publishedat;
  return (
    <div className={styles.versionsInfo}>
      <Join>
        <Text className={styles.subtitle}>Version {oldVersion}</Text>
        <Event timestamp={oldTimestamp} />
        <div className={styles.versionDownloads}>
          <ProposalDownloads
            withoutComments={true}
            record={oldRecord}
            onFetchRecordTimestamps={onFetchTimestamps}
          />
        </div>
      </Join>
      {oldVersion !== newVersion && (
        <Join>
          <Text className={styles.subtitle}>Version {newVersion}</Text>
          <Event timestamp={newTimestamp} />
          <div className={styles.versionDownloads}>
            <ProposalDownloads
              withoutComments={true}
              record={newRecord}
              onFetchRecordTimestamps={onFetchTimestamps}
            />
          </div>
        </Join>
      )}
    </div>
  );
}

function ProposalDiff({
  currentProposal,
  oldVersion,
  newVersion,
  token,
  onFetchTimestamps,
}) {
  const dispatch = useDispatch();
  const [oldV, setOldV] = useState(oldVersion);
  const [newV, setNewV] = useState(newVersion);
  // Records
  const oldRecord = useSelector((state) =>
    records.selectVersionByToken(state, { version: oldV, token })
  );
  const newRecord = useSelector((state) =>
    records.selectVersionByToken(state, { version: newV, token })
  );
  // Fetch Statuses
  const oldStatus = useSelector((state) =>
    records.selectVersionStatusByToken(state, { version: oldV, token })
  );
  const newStatus = useSelector((state) =>
    records.selectVersionStatusByToken(state, { version: newV, token })
  );
  // Proposals
  const oldProposal = decodeProposalRecord(oldRecord);
  const newProposal = decodeProposalRecord(newRecord);
  // Proposals decoded files
  const oldImagesByDigest = getImagesByDigest(
    oldProposal?.body,
    oldProposal?.attachments
  );
  const newImagesByDigest = getImagesByDigest(
    newProposal?.body,
    newProposal?.attachments
  );
  const oldProposalAttachments = oldProposal?.attachments.filter(
    (f) => !oldImagesByDigest[f.digest]
  );
  const newProposalAttachments = newProposal?.attachments.filter(
    (f) => !newImagesByDigest[f.digest]
  );
  const imagesByDigest = { ...oldImagesByDigest, ...newImagesByDigest };
  // Effect for versions changes
  useEffect(
    function handleNewVersionChange() {
      if (!newStatus) {
        dispatch(records.fetchVersionDetails({ token, version: newV }));
      }
    },
    [token, dispatch, newV, newStatus]
  );
  useEffect(
    function handleOldVersionChange() {
      if (!oldStatus) {
        dispatch(records.fetchVersionDetails({ token, version: oldV }));
      }
    },
    [token, dispatch, oldV, oldStatus]
  );
  return (
    <div className={styles.diffWrapper}>
      <RecordCard
        title={currentProposal.name}
        headerClassName={styles.diffHeader}
        rightHeader={
          <VersionsPickers
            oldVersion={oldV}
            newVersion={newV}
            latestVersion={currentProposal.version}
            setOldVersion={setOldV}
            setNewVersion={setNewV}
          />
        }
        subtitle={
          <VersionsInfo
            oldProposal={oldProposal}
            newProposal={newProposal}
            oldRecord={oldRecord}
            newRecord={newRecord}
            onFetchTimestamps={onFetchTimestamps}
          />
        }
        thirdRow={
          oldStatus === "succeeded" &&
          newStatus === "succeeded" && (
            <div className={styles.diffBody}>
              <MarkdownDiffHTML
                oldText={oldProposal?.body}
                newText={newProposal?.body}
                filesBySrc={imagesByDigest}
              />
              <AttachmentsDiff
                oldFiles={oldProposalAttachments}
                newFiles={newProposalAttachments}
              />
            </div>
          )
        }
      />
    </div>
  );
}

function ModalProposalDiff({
  onClose,
  show,
  oldVersion,
  newVersion,
  currentProposal,
  token,
  onFetchTimestamps,
}) {
  return (
    <Modal
      show={show}
      onClose={onClose}
      title={<ModalTitle />}
      className={styles.modalWrapper}
      contentClassName={styles.modalContent}
    >
      <ProposalDiff
        oldVersion={oldVersion}
        newVersion={newVersion}
        currentProposal={currentProposal}
        token={token}
        onFetchTimestamps={onFetchTimestamps}
      />
    </Modal>
  );
}

export default ModalProposalDiff;
