import React from "react";
import { Event } from "@politeiagui/common-ui";
import styles from "./styles.module.css";
import { getProposalStatusDescription } from "../../../pi/proposals/utils";
import { PROPOSAL_STATUS_VOTE_STARTED } from "../../../pi/lib/constants";

function ProposalStatusLabel({ statusChange }) {
  if (!statusChange) return null;
  const { event, description } = getProposalStatusDescription(statusChange);
  return (
    <div className={styles.statusLabelWrapper}>
      {event && (
        <Event
          event={event}
          timestamp={statusChange.timestamp}
          className={styles.statusLabel}
        />
      )}
      {description && (
        <div className={styles.statusLabelText}>{description}</div>
      )}
      {statusChange.blocksCount &&
        statusChange.status === PROPOSAL_STATUS_VOTE_STARTED && (
          <div className={styles.statusLabelText}>
            {-statusChange.blocksCount} blocks left
          </div>
        )}
    </div>
  );
}

export default ProposalStatusLabel;
