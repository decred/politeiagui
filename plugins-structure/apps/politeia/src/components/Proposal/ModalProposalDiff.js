import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { H2, Icon, Modal, Select, Text } from "pi-ui";
import {
  Event,
  Join,
  MarkdownDiffHTML,
  RecordCard,
} from "@politeiagui/common-ui";
import { records } from "@politeiagui/core/records";
import { decodeProposalRecord } from "./utils";
import styles from "./ModalProposalDiff.module.css";
import range from "lodash/range";

function ModalTitle() {
  return (
    <div className={styles.modalHeader}>
      <H2>Compare Changes</H2>
      <Text className={styles.modalSubtitle}>
        Compare changes across different versions of the record.
      </Text>
    </div>
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

function VersionsTimestamps({ oldProposal, newProposal }) {
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
    <Join>
      <Event timestamp={oldTimestamp} />
      {oldVersion !== newVersion && <Event timestamp={newTimestamp} />}
    </Join>
  );
}

function ProposalDiff({ currentProposal, oldVersion, newVersion, token }) {
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
        rightHeader={
          <VersionsPickers
            oldVersion={oldV}
            newVersion={newV}
            latestVersion={currentProposal.version}
            setOldVersion={setOldV}
            setNewVersion={setNewV}
          />
        }
        secondRow={
          <VersionsTimestamps
            oldProposal={oldProposal}
            newProposal={newProposal}
          />
        }
        thirdRow={
          <div className={styles.diffBody}>
            <MarkdownDiffHTML
              oldText={oldProposal?.body}
              newText={newProposal?.body}
            />
          </div>
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
}) {
  return (
    <Modal
      show={show}
      onClose={onClose}
      title={<ModalTitle />}
      className={styles.modalWrapper}
    >
      <ProposalDiff
        oldVersion={oldVersion}
        newVersion={newVersion}
        currentProposal={currentProposal}
        token={token}
      />
    </Modal>
  );
}

export default ModalProposalDiff;
