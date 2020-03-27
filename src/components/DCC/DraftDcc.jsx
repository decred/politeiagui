import React from "react";
import PropTypes from "prop-types";
import { Button, Text } from "pi-ui";
import RecordWrapper from "../RecordWrapper";
import {
  presentationalDraftDccName,
  presentationalDccDomain,
  presentationalStatement
} from "src/containers/DCC/helpers";
import styles from "./DraftDcc.module.css";

const DraftDcc = ({ draft, onDelete }) => {
  const { id, timestamp, statement, domain } = draft;
  function handleDeleteDraft() {
    onDelete(id);
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
                  id={`dcc-${id}`}
                  truncate
                  linesBeforeTruncate={2}
                  url={`/dccs/new?draft=${id}`}
                >
                  {presentationalDraftDccName(draft)}
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
              edit={<Edit url={`/dccs/new?draft=${id}`} />}
              subtitle={
                <Subtitle>
                  <Event keepOnMobile event="edited" timestamp={timestamp} />
                  { domain && <Text id="draft-domain">{presentationalDccDomain(domain)}</Text> }
                  { statement && (
                    <Text truncate={true} id="draft-statement">
                      {presentationalStatement(statement)}
                    </Text>
                  )}
                </Subtitle>
              }
            />
          </>
        )}
      </RecordWrapper>
    </>
  );
};

DraftDcc.propTypes = {
  draft: PropTypes.object,
  onDelete: PropTypes.func
};

export default React.memo(DraftDcc);
