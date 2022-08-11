import React from "react";
import { Tooltip } from "pi-ui";
import styles from "./styles.module.css";

function RfpTag() {
  return (
    <Tooltip contentClassName={styles.rfpTooltip} className={styles.rfpTag}>
      <div>RFP</div>
    </Tooltip>
  );
}

function ProposalTitle({ title, isRfp }) {
  return (
    <div className={styles.proposalTitle}>
      {isRfp && <RfpTag />}
      {title}
    </div>
  );
}

export default ProposalTitle;
