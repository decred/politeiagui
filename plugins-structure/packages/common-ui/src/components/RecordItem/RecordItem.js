import React from "react";
import { classNames } from "pi-ui";
import styles from "./styles.module.css";

const TitleWrapper = ({ titleLink, children }) => (
  <div className={styles.title}>
    {!titleLink ? (
      children
    ) : (
      <a href={titleLink} data-link className={styles.titleLink}>
        {children}
      </a>
    )}
  </div>
);

export function RecordItem({
  className,
  title,
  titleLink,
  subtitle,
  info,
  tag,
}) {
  return (
    <div className={classNames(className, styles.wrapper)}>
      <TitleWrapper titleLink={titleLink}>
        <p>{title}</p>
      </TitleWrapper>
      <div className={styles.subtitle}>{subtitle}</div>
      <div className={styles.info}>{info}</div>
      <div className={styles.tag}>{tag}</div>
    </div>
  );
}
