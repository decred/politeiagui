import React from "react";
import RecordWrapper from "../RecordWrapper";
import styles from "./DraftProposal.module.css";
import { PROPOSAL_TYPE_RFP } from "src/constants";

const DraftProposal = ({ draft, onDelete }) => {
  const { name, draftId, timestamp, type } = draft;
  function handleDeleteDraft() {
    onDelete(draftId);
  }
  return (
    <>
      <RecordWrapper>
        {({ Event, Title, Header, Subtitle, Edit, Status }) => (
          <>
            <Header
              disableMobileView
              title={
                <Title
                  id={`proposal-title-${draftId}`}
                  truncate
                  linesBeforeTruncate={2}
                  url={`/record/new?draft=${draftId}`}>
                  {name}
                </Title>
              }
              status={
                <Status disableMobileView>
                  <button
                    onClick={handleDeleteDraft}
                    className={styles.deleteDraft}>
                    &times;
                  </button>
                </Status>
              }
              isRfp={type === PROPOSAL_TYPE_RFP}
              edit={<Edit url={`/record/new?draft=${draftId}`} />}
              subtitle={
                <Subtitle>
                  <Event keepOnMobile event="edited" timestamp={timestamp} />
                </Subtitle>
              }
            />
          </>
        )}
      </RecordWrapper>
    </>
  );
};

export default React.memo(DraftProposal);
