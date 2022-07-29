import React from "react";
import { Card, H2, classNames } from "pi-ui";
import styles from "./styles.module.css";

const TitleWrapper = ({ titleLink, children }) =>
  !titleLink ? (
    <H2>{children}</H2>
  ) : (
    <H2>
      <a href={titleLink} data-link className={styles.title}>
        {children}
      </a>
    </H2>
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
        <H2 className={styles.title}>
          <TitleWrapper titleLink={titleLink}>{title}</TitleWrapper>
        </H2>
        <div className={styles.rightHeader}>{rightHeader}</div>
        <div className={styles.subtitle}>{subtitle}</div>
        <div className={styles.rightHeaderSubtitle}>{rightHeaderSubtitle}</div>
      </div>
      {secondRow && <div className={styles.secondRow}>{secondRow}</div>}
      {thirdRow && <div className={styles.thirdRow}>{thirdRow}</div>}
      {fourthRow && <div className={styles.fourthRow}>{fourthRow}</div>}
      <div className={styles.footer}>{footer}</div>
    </Card>
  );
}
