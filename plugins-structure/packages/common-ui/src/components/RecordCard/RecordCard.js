import React from "react";
import { Card, H2, classNames } from "pi-ui";
import styles from "./styles.module.css";

const TitleWrapper = ({ titleLink, children }) =>
  !titleLink ? (
    children || null
  ) : (
    <a
      href={titleLink}
      data-testid="record-card-title-link"
      data-link
      className={styles.title}
    >
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
      data-testid="record-card"
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
      {secondRow && (
        <div className={styles.secondRow} data-testid="record-card-second-row">
          {secondRow}
        </div>
      )}
      {thirdRow && (
        <div className={styles.thirdRow} data-testid="record-card-third-row">
          {thirdRow}
        </div>
      )}
      {fourthRow && (
        <div className={styles.fourthRow} data-testid="record-card-fourth-row">
          {fourthRow}
        </div>
      )}
      {footer && (
        <div className={styles.footer} data-testid="record-card-footer">
          {footer}
        </div>
      )}
    </Card>
  );
}
