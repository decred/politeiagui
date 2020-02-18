import React, { useState, useMemo, useCallback } from "react";
import { Button, Dropdown, DropdownItem, StatusBar, useMediaQuery, Link } from "pi-ui";
import { useDccActions } from "./hooks";
import { dccSupportOpposeStatus, dccSupportOpposeList, isDccSupportOpposeAvailable } from "../helpers";
import ModalVotesList from "src/componentsv2/ModalVotesList";
import useNavigation from "src/hooks/api/useNavigation";
import useBooleanState from "src/hooks/utils/useBooleanState";
import ModalConfirm from "src/componentsv2/ModalConfirm";

const SupportOpposeActions = ({ dcc, token, className }) => {
  const { onSupportDcc, onOpposeDcc } = useDccActions(token);
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
  const { user: { userid } } = useNavigation();
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
  }, [setSupportOpposeAction, openConfirmModal]);

  const handleOpposeDcc = useCallback(() => {
    setSupportOpposeAction(() => onOpposeDcc);
    openConfirmModal();
  }, [setSupportOpposeAction, openConfirmModal]);

  const isVotingAvailable = useMemo(() => isDccSupportOpposeAvailable(userid, dcc), [dcc]);

  const supportButton = (
    <Button onClick={handleSupportDcc}>Support</Button>
  );

  const opposeButton = (
    <Button kind="secondary" onClick={handleOpposeDcc}>Oppose</Button>
  );

  return <>
    <div className={className}>
      <StatusBar
        status={dccSupportOpposeStatus(supportuserids, againstuserids)}
        showMarker={false}
        renderStatusInfoComponent={<Link href="#" onClick={openVotingModal}>Votes</Link>}
      />
    </div>
    {isVotingAvailable && <>
      {!mobile ? (
        <div className="margin-top-s">
          {supportButton}
          {opposeButton}
        </div>
      ) : (
        <Dropdown title="Support/Oppose">
          <DropdownItem>{supportButton}</DropdownItem>
          <DropdownItem>{opposeButton}</DropdownItem>
        </Dropdown>
      )}
    </>}
    <ModalVotesList
      show={showVotingModal}
      supportList={dccSupportOpposeList(supportuserids, supportusernames)}
      againstList={dccSupportOpposeList(againstuserids, againstusernames)}
      onClose={closeVotingModal}
      currentID={userid}
    />
    <ModalConfirm
      show={showConfirmModal}
      onClose={closeConfirmModal}
      onSubmit={supportOpposeAction}
    />
  </>;
};

export default SupportOpposeActions;
