import React from "react";
import { Card, classNames } from "pi-ui";
import styles from "./styles.module.css";

function InfoCard({ title, children, noPadding, footer, hide }) {
  return !hide ? (
    <Card
      className={classNames(styles.infoCard, noPadding && styles.noPadding)}
    >
      {title ? <div className={styles.title}>{title}</div> : null}
      {children ? <div className={styles.body}>{children}</div> : null}
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </Card>
  ) : null;
}

export default InfoCard;
