import React from "react";
import { Card, H2, classNames } from "pi-ui";
import styles from "./styles.module.css";

const TitleWrapper = ({ titleLink, children }) =>
  !titleLink ? (
    children
  ) : (
    <a href={titleLink} data-link className={styles.title}>
      {children}
    </a>
  );

export function RecordCard({
  title,
  titleLink,
  subtitle,
  rightHeader,
  rightHeaderSubtitle,
  secondRow,
  thirdRow,
  fourthRow,
  footer,
  isDimmed,
  className,
  headerClassName,
}) {
  return (
    <Card
      className={classNames(
        styles.card,
        isDimmed && styles.dimmedCard,
        className
      )}
    >
      <div className={classNames(styles.headerWrapper, headerClassName)}>
        <H2 className={styles.title} data-testid="record-card-title">
          <TitleWrapper titleLink={titleLink}>{title}</TitleWrapper>
        </H2>
        <div
          className={styles.rightHeader}
          data-testid="record-card-right-header"
        >
          {rightHeader}
          {rightHeaderSubtitle}
        </div>
        <div className={styles.subtitle} data-testid="record-card-subtitle">
          {subtitle}
        </div>
      </div>
      {secondRow && <div className={styles.secondRow}>{secondRow}</div>}
      {thirdRow && <div className={styles.thirdRow}>{thirdRow}</div>}
      {fourthRow && <div className={styles.fourthRow}>{fourthRow}</div>}
      <div className={styles.footer}>{footer}</div>
    </Card>
  );
}
