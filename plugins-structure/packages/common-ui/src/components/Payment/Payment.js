import React, { useEffect, useState } from "react";
import { generateQrCode } from "@politeiagui/core";
import styles from "./styles.module.css";
import { CopyableText, StatusTag } from "pi-ui";

export const Payment = ({ value, address, id = "payment" }) => {
  const [code, setCode] = useState();
  useEffect(() => {
    generateQrCode(`decred:${address}`).then((c) => setCode(c));
  }, [address]);
  return (
    <div className={styles.payment}>
      <div className={styles.tag}>
        <StatusTag text="Waiting Payment" type="yellowTime" />
      </div>
      <img src={code} alt="User Registration Fee" />
      <div className={styles.instructions}>
        <div>
          <b>Send:</b>
        </div>
        <span>{value} DCR</span>
        <div>
          <b>To:</b>
          <CopyableText id={id}>{address}</CopyableText>
        </div>
      </div>
    </div>
  );
};
