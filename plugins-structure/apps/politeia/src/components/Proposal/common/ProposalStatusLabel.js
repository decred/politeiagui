import React from "react";
import { Event } from "@politeiagui/common-ui";
import styles from "./styles.module.css";
import { getProposalStatusEvent } from "../../../pi/proposals/utils";
import { PROPOSAL_STATUS_VOTE_STARTED } from "../../../pi/lib/constants";

function ProposalStatusLabel({ statusChange }) {
  const event = getProposalStatusEvent(statusChange);
  return statusChange?.timestamp && event ? (
    <div>
      <Event
        event={event}
        timestamp={statusChange.timestamp}
        className={styles.statusLabel}
      />
      {statusChange.blocksCount &&
        statusChange.status === PROPOSAL_STATUS_VOTE_STARTED && (
          <div className={styles.statusLabelBlocks}>
            {-statusChange.blocksCount} blocks left
          </div>
        )}
    </div>
  ) : null;
}

export default ProposalStatusLabel;
