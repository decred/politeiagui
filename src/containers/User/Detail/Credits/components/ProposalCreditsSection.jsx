import React from "react";
import styles from "../Credits.module.css";
import { Text, P, classNames } from "pi-ui";

export default ({ proposalCredits, proposalCreditPrice }) =>
  <div className={classNames(styles.block, "margin-top-l")}>
    <div className={styles.blockDetails}>
      <Text className={styles.title}>Proposal Credits</Text>
      <Text
        size="large"
        className={classNames(
          styles.status,
          "margin-top-xs margin-bottom-xs"
        )}
      >
        {proposalCredits}
      </Text>
    </div>
    <div className={styles.description}>
      <P className={styles.descriptionParagraph}>
        <b>Proposal credits:</b> each proposal submission requires{" "}
        <b>1 proposal</b> credit which costs{" "}
        <b>exactly {proposalCreditPrice || 0.1} DCR</b>.
      </P>
    </div>
  </div>;
