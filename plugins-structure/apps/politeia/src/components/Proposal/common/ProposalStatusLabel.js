import React from "react";
import { Event } from "@politeiagui/common-ui";
import { Tooltip } from "pi-ui";
import styles from "./styles.module.css";
import { getProposalStatusDescription } from "../../../pi/proposals/utils";

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
      {statusChange.blocksCount > 0 && (
        <Tooltip
          content={`${statusChange.startblockheight} to ${statusChange.endblockheight}`}
          placement="bottom"
          contentClassName={styles.statusLabelTooltip}
          className={styles.statusLabelText}
        >
          {statusChange.blocksCount} blocks left
        </Tooltip>
      )}
    </div>
  );
}

export default ProposalStatusLabel;
