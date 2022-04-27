import React from "react";
import { RecordCard } from "@politeiagui/common-ui";
import styles from "./styles.module.css";

const Block = () => <div className={styles.block} />;
const BigBlock = () => (
  <div style={{ height: "30rem" }} className={styles.block} />
);
const MediumBlock = () => (
  <div style={{ height: "10rem", width: "50%" }} className={styles.block} />
);

function ProposalLoader({ isDetails }) {
  return (
    <div className={styles.loaderWrapper}>
      <RecordCard
        title={<Block />}
        rightHeader={<Block />}
        subtitle={<Block />}
        secondRow={isDetails && <MediumBlock />}
        thirdRow={isDetails ? <BigBlock /> : <Block />}
      />
    </div>
  );
}

export default ProposalLoader;
