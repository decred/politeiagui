import React from "react";
import PropTypes from "prop-types";
import { Button } from "pi-ui";
import RecordWrapper from "../RecordWrapper";
import { presentationalDraftInvoiceName } from "src/containers/Invoice/helpers";
import styles from "./DraftInvoice.module.css";

const DraftInvoice = ({ draft, onDelete }) => {
  const { draftId, timestamp } = draft;
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
                  id={`invoice-${draftId}`}
                  truncate
                  linesBeforeTruncate={2}
                  url={`/invoices/new?draft=${draftId}`}
                >
                  {presentationalDraftInvoiceName(draft)}
                </Title>
              }
              status={
                <Status>
                  <Button
                    kind="secondary"
                    size="sm"
                    className={styles.deleteDraft}
                    onClick={handleDeleteDraft}
                  >
                    Delete
                  </Button>
                </Status>
              }
              edit={<Edit url={`/invoices/new?draft=${draftId}`} />}
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

DraftInvoice.propTypes = {
  draft: PropTypes.object,
  onDelete: PropTypes.func
};

export default React.memo(DraftInvoice);
