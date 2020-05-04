import React from "react";
import RecordWrapper from "../RecordWrapper";
import styles from "./DraftProposal.module.css";

const DraftProposal = ({ draft, onDelete }) => {
  const { name, draftId, timestamp } = draft;
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
                  url={`/proposals/new?draft=${draftId}`}>
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
              edit={<Edit url={`/proposals/new?draft=${draftId}`} />}
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
