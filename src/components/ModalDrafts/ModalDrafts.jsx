import React from "react";
import { Modal, H3, Card } from "pi-ui";
import { Event, Title, RfpTag } from "../RecordWrapper/RecordWrapper";
import styles from "./ModalDrafts.module.css";
import { withRouter } from "react-router-dom";
import { PROPOSAL_TYPE_RFP } from "src/constants";

const ModalDrafts = ({ show, onClose, drafts, history }) => {
  const handleClick = (draftId) => () => {
    onClose();
    history.push(`/record/new?draft=${draftId}`);
  };
  return (
    <Modal show={show} onClose={onClose} style={{ width: "600px" }}>
      <H3 className={styles.modalTitle}>My Drafts</H3>
      <div className="margin-bottom-m margin-top-m">
        {drafts.map((draft) => (
          <Card
            className={styles.draftWrapper}
            onClick={handleClick(draft.draftId)}>
            {draft.type === PROPOSAL_TYPE_RFP ? (
              <Title>
                <RfpTag />
                <span className={styles.draftTitleRfp}>{draft.name}</span>
              </Title>
            ) : (
              <Title>{draft.name}</Title>
            )}
            <Event event="" timestamp={draft.timestamp} />
          </Card>
        ))}
      </div>
    </Modal>
  );
};
export default withRouter(ModalDrafts);
