import React from "react";
import { RecordCard } from "@politeiagui/common-ui";
import styles from "./styles.module.css";

const Block = () => <div className={styles.block} />;

function ProposalLoader() {
  return (
    <div className={styles.loaderWrapper}>
      <RecordCard
        title={<Block />}
        titleWithoutLink
        rightHeader={<Block />}
        subtitle={<Block />}
        thirdRow={<Block />}
      />
    </div>
  );
}

export default ProposalLoader;
