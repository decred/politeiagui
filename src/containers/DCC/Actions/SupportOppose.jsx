import React, { useMemo, useCallback } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  StatusBar,
  useMediaQuery,
  Link,
  Message,
  classNames
} from "pi-ui";
import {
  dccSupportOpposeStatus,
  dccSupportOpposeList,
  isDccSupportOpposeAvailable
} from "../helpers";
import { useDccActions } from "./hooks";
import ModalVotesList from "src/components/ModalVotesList";
import ModalConfirm from "src/components/ModalConfirm";
import useModalContext from "src/hooks/utils/useModalContext";

const SupportOpposeActions = ({ dcc, token, className, buttonsClassName }) => {
  const { onSupportDcc, onOpposeDcc, userID, isContractor, loading, error } =
    useDccActions(token);

  const mobile = useMediaQuery("(max-width: 560px)");

  const { supportuserids, supportusernames, againstuserids, againstusernames } =
    dcc;

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const handleOpenVotesList = () => {
    handleOpenModal(ModalVotesList, {
      supportList: dccSupportOpposeList(supportuserids, supportusernames),
      againstList: dccSupportOpposeList(againstuserids, againstusernames),
      onClose: handleCloseModal,
      currentID: userID
    });
  };

  const handleOpenModalConfirm = useCallback(
    (action) => {
      handleOpenModal(ModalConfirm, {
        onClose: handleCloseModal,
        onSubmit: action,
        title: "Support/Oppose DCC"
      });
    },
    [handleCloseModal, handleOpenModal]
  );

  const handleSupportDcc = useCallback(() => {
    handleOpenModalConfirm(onSupportDcc);
  }, [handleOpenModalConfirm, onSupportDcc]);

  const handleOpposeDcc = useCallback(() => {
    handleOpenModalConfirm(onOpposeDcc);
  }, [handleOpenModalConfirm, onOpposeDcc]);

  const isVotingAvailable = useMemo(
    () => isDccSupportOpposeAvailable(userID, dcc) && isContractor,
    [dcc, userID, isContractor]
  );

  const supportButton = <Button onClick={handleSupportDcc}>Support</Button>;

  const opposeButton = (
    <Button kind="secondary" onClick={handleOpposeDcc}>
      Oppose
    </Button>
  );

  return error ? (
    <Message kind="error">
      Could not fetch user list. {error.toString()}
    </Message>
  ) : (
    !loading && (
      <>
        {}
        <div className={className}>
          <StatusBar
            status={dccSupportOpposeStatus(supportuserids, againstuserids)}
            showMarker={false}
            renderStatusInfoComponent={
              <Link href="#" onClick={handleOpenVotesList}>
                Votes
              </Link>
            }
          />
        </div>
        {isVotingAvailable && !mobile && (
          <div
            className={classNames(
              "margin-top-s justify-right",
              buttonsClassName
            )}>
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
      </>
    )
  );
};

export default SupportOpposeActions;
