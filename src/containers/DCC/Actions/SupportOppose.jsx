import React, { useState, useMemo, useCallback } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  StatusBar,
  useMediaQuery,
  Link,
  Message
} from "pi-ui";
import {
  dccSupportOpposeStatus,
  dccSupportOpposeList,
  isDccSupportOpposeAvailable
} from "../helpers";
import { useDccActions } from "./hooks";
import ModalVotesList from "src/componentsv2/ModalVotesList";
import useBooleanState from "src/hooks/utils/useBooleanState";
import ModalConfirm from "src/componentsv2/ModalConfirm";

const SupportOpposeActions = ({ dcc, token, className }) => {
  const { onSupportDcc, onOpposeDcc, userID, isContractor, loading, error } = useDccActions(token);
  const [supportOpposeAction, setSupportOpposeAction] = useState(() => {});
  const [
    showVotingModal,
    openVotingModal,
    closeVotingModal
  ] = useBooleanState(false);
  const [
    showConfirmModal,
    openConfirmModal,
    closeConfirmModal
  ] = useBooleanState(false);
  const mobile = useMediaQuery("(max-width: 560px)");

  const {
    supportuserids,
    supportusernames,
    againstuserids,
    againstusernames
  } = dcc;

  const handleSupportDcc = useCallback(() => {
    setSupportOpposeAction(() => onSupportDcc);
    openConfirmModal();
  }, [setSupportOpposeAction, openConfirmModal, onSupportDcc]);

  const handleOpposeDcc = useCallback(() => {
    setSupportOpposeAction(() => onOpposeDcc);
    openConfirmModal();
  }, [setSupportOpposeAction, openConfirmModal, onOpposeDcc]);

  const isVotingAvailable = useMemo(() => (
      isDccSupportOpposeAvailable(userID, dcc)
      && isContractor
    ), [dcc, userID, isContractor]);

  const supportButton = (
    <Button onClick={handleSupportDcc}>Support</Button>
  );

  const opposeButton = (
    <Button kind="secondary" onClick={handleOpposeDcc}>Oppose</Button>
  );

  return !loading && <>
    {error && <Message kind="error">
      User not logged in
    </Message>}
    <div className={className}>
      <StatusBar
        status={dccSupportOpposeStatus(supportuserids, againstuserids)}
        showMarker={false}
        renderStatusInfoComponent={<Link href="#" onClick={openVotingModal}>Votes</Link>}
      />
    </div>
    {isVotingAvailable && !mobile && (
      <div className="margin-top-s justify-right">
        {supportButton}
        {opposeButton}
      </div>
    )}
    {isVotingAvailable && mobile && (
      <Dropdown title="Support/Oppose">
        <DropdownItem>{supportButton}</DropdownItem>
        <DropdownItem>{opposeButton}</DropdownItem>
      </Dropdown>
    )}
    <ModalVotesList
      show={showVotingModal}
      supportList={dccSupportOpposeList(supportuserids, supportusernames)}
      againstList={dccSupportOpposeList(againstuserids, againstusernames)}
      onClose={closeVotingModal}
      currentID={userID}
    />
    <ModalConfirm
      show={showConfirmModal}
      onClose={closeConfirmModal}
      onSubmit={supportOpposeAction}
      title="Support/Oppose DCC"
    />
  </>;
};

export default SupportOpposeActions;
